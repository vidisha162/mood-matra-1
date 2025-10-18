import ChatMessage from "../models/chatMessageModel.js";
import User from "../models/userModel.js";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { getSystemPrompt } from "../config/chatPrompts.js";
import mongoose from "mongoose";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index(process.env.PINECONE_INDEX_NAME);

// Helper: Generate structured chat summary with assessment results
const generateChatSummary = async (messages, userAssessments) => {
  try {
    // 1️⃣ System prompt: instructions only
    const systemPrompt = {
      role: "system",
      content: `You are a healthcare assistant. Summarize the chat messages and assessment results in the following format:

Chat Overview:
- Key points discussed
- Main concerns/topics
- Recommendations given

Assessment Results Summary:
- Assessment Name:
  - Score
  - Result
  - Key Recommendations

Focus only on actionable insights and important discussion points. Do not add greetings or extra commentary.`
    };

    // 2️⃣ Combine all chat messages as plain text
    const messagesText = messages
      .map(m => `${m.sender === "user" ? "Patient" : "Assistant"}: ${m.content}`)
      .join("\n");

    // 3️⃣ Combine all assessment results as plain text
    const assessmentsText = userAssessments?.length
      ? userAssessments.map(a => `
${a.assessmentId?.title || 'Assessment'}:
- Score: ${a.totalScore}
- Result: ${a.result}
- Key Recommendations: ${a.recommendations.join(', ')}`).join("\n")
      : "No assessments available";

    // 4️⃣ User message containing all data
    const userContent = {
      role: "user",
      content: `Chat messages:\n${messagesText}\n\nAssessment results:\n${assessmentsText}`
    };

    // 5️⃣ Call GPT
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemPrompt, userContent],
      max_tokens: 500,
      temperature: 0.2
    });

    // 6️⃣ Return the summary
    return response.choices[0].message.content;

  } catch (error) {
    console.error("Error generating summary:", error);
    return "Error generating summary";
  }
};

// Helper: sanitize message
function sanitizeMessage(msg) {
  return {
    sender: msg.sender === "user" ? "user" : "bot",
    content: String(msg.content).trim(),
    timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
  };
}

// Save chat message(s)
export const saveChatMessage = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { messages } = req.body;
    const sessionId = req.body.sessionId;
    
    if (!userId || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid input" });
    }
    
    // Validate user exists
    const user = await User.findById(userId);
    if (!user)
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });

    // Sanitize messages
    const sanitizedMessages = messages.map(sanitizeMessage);

    // Find or create user's conversation (limit to last 100 messages)
    let chat;
    if (sessionId) {
      chat = await ChatMessage.findOne({ userId, sessionId });
    } else {
      chat = await ChatMessage.findOne({ userId, isActive: true });
    }

    if (!chat) {
      chat = new ChatMessage({
        userId,
        sessionId: sessionId || new mongoose.Types.ObjectId().toString(),
        isActive: true,
        messages: sanitizedMessages,
      });
    } else {
      chat.messages = [...chat.messages, ...sanitizedMessages].slice(-100);
    }
    await chat.save();
    res.json({ success: true, chat });
  } catch (err) {
    console.error("Save chat error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get chat history
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    const sessionId = req.query.sessionId;
    
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    
    // Validate user exists
    const user = await User.findById(userId);
    if (!user)
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });

    // If sessionId is provided, get that specific session
    // Otherwise, get the active session
    const query = sessionId 
      ? { userId, sessionId }
      : { userId, isActive: true };

    const chat = await ChatMessage.findOne(query);
    res.json({ chat });
  } catch (err) {
    console.error("Get chat history error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Clear chat history (creates new session)
export const clearChatHistory = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    
    // Validate user exists
    const user = await User.findById(userId);
    if (!user)
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });

    // Mark current session as inactive
    await ChatMessage.updateMany(
      { userId, isActive: true },
      { $set: { isActive: false } }
    );

    // Create new empty session
    const newSession = new ChatMessage({
      userId,
      sessionId: new mongoose.Types.ObjectId().toString(),
      isActive: true,
      messages: []
    });
    await newSession.save();

    res.json({ success: true, sessionId: newSession.sessionId });
  } catch (err) {
    console.error("Clear chat history error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get chat summary with assessment results
export const getChatSummary = async (req, res) => {
  try {
    // Get userId from auth middleware
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: "Authentication required" 
      });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    // Get active chat session
    const chat = await ChatMessage.findOne({ userId, isActive: true });
    if (!chat) {
      // If no chat exists, return empty summary
      return res.json({ 
        success: true, 
        summary: "No chat history available.",
        messageCount: 0,
        assessmentCount: 0 
      });
    }

    // Get user's assessments from request or fetch them
    const userAssessments = req.body.userAssessments || [];

    // Generate summary
    const summary = await generateChatSummary(chat.messages, userAssessments);

    res.json({ 
      success: true, 
      summary,
      chatId: chat._id,
      messageCount: chat.messages.length,
      assessmentCount: userAssessments.length 
    });

  } catch (err) {
    console.error("Get chat summary error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Send message: save user message, call OpenAI, save bot reply, return reply
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { message, userAssessments, doctors } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Only validate user if userId is provided (for logged-in users)
    let user = null;
    if (userId) {
      user = await User.findById(userId);
      console.log(user);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    }

    // Save user message (non-blocking)
    const userMsg = sanitizeMessage({ sender: "user", content: message });
    let chat = await ChatMessage.findOne({ userId, isActive: true });
    if (!chat) {
      chat = new ChatMessage({ userId, messages: [userMsg] });
    } else {
      chat.messages = [...chat.messages, userMsg].slice(-50);
    }
    chat.save().catch(console.error); // don’t block

    // Create embedding
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: message,
    });
    const embedding = embeddingRes.data[0].embedding;

    // Query Pinecone
    const queryRes = await index.query({
      vector: embedding,
      topK: 8,
      includeMetadata: true,
    });

    const contextDocs = queryRes.matches
      .map((m) => m.metadata?.text)
      .filter(Boolean)
      .join("\n\n");

    // Build prompt - for guest users, we don't include conversation history
    const convo = userId && chat?.messages && chat?.isActive
      ? chat.messages.slice(-10).map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.content,
        }))
      : [];

    // Get the system prompt based on user status
    const systemPrompt = getSystemPrompt(user, userAssessments, doctors);

    // Construct messages array with personalization based on user status
    const systemMessages = [
      { role: "system", content: systemPrompt },
      {
        role: "system",
        name: "retrieved_context",
        content: contextDocs || "No additional context available.",
      }
    ];

    const messages = [
      ...systemMessages,
      ...convo,
      { role: "user", content: message }
    ];

    // Call OpenAI (reduce max_tokens for speed)
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });
    const botReply = response.choices?.[0]?.message?.content?.trim();
    // Save bot reply async only for logged-in users
    if (userId) {
      const botMsg = sanitizeMessage({ sender: "bot", content: botReply });
      if (chat && chat.isActive) {
        chat.messages = [...chat.messages, botMsg].slice(-50);
        chat.save().catch(console.error);
      }
    }

    // Respond immediately
    res.json({ success: true, reply: botReply });
  } catch (err) {
    console.log("Send message error:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};
