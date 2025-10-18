
import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import {
  Check,
  X,
  FileText,
  User,
  Calendar,
  Eye,
  Star,
  Loader2,
  Edit,
  Send,
  Trash2,
  Save,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const BlogPosts = () => {
  const {
    aToken,
    backendUrl,
    pendingPosts,
    pendingPostsCount,
    getPendingBlogPosts,
    reviewBlogPost,
    blogs,
    getAllBlogs,
  } = useContext(AdminContext);

  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const fetchPendingPosts = async () => {
    try {
      setIsLoading(true);
      await getPendingBlogPosts();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllBlogs = async () => {
    try {
      setIsLoading(true);
      await getAllBlogs();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "pending") {
      fetchPendingPosts();
    } else {
      fetchAllBlogs();
    }
  }, [activeTab]);

  const handleReview = (action, post) => {
    setReviewAction(action);
    setSelectedPost(post);
    setAdminNotes("");
    setIsFeatured(false);
    setReviewModal(true);
  };

  const submitReview = async () => {
    if (!selectedPost) return;

    setIsSubmitting(true);
    try {
      let status = "";
      switch (reviewAction) {
        case "approve":
          status = "approved";
          break;
        case "reject":
          status = "rejected";
          break;
        case "revision":
          status = "pending";
          break;
        default:
          return;
      }

      await reviewBlogPost(selectedPost._id, status, adminNotes, isFeatured);
      setReviewModal(false);
      setSelectedPost(null);
      setAdminNotes("");
      setIsFeatured(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete blog
  const handleDeleteBlog = async (blogId, blogTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${blogTitle}"?`))
      return;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/delete-blog`,
        { blogId },
        { headers: { atoken: aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        if (activeTab === "pending") {
          fetchPendingPosts();
        } else {
          fetchAllBlogs();
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    }
  };

  // Open edit modal
  const openEditModal = (blog) => {
    setEditingBlog({
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      category: blog.category,
      excerpt: blog.excerpt || "",
      status: blog.status || "published",
    });
    setShowEditModal(true);
  };

  // Open create new blog modal
  const openCreateModal = () => {
    setEditingBlog({
      _id: null,
      title: "",
      content: "",
      category: "",
      excerpt: "",
      status: "published",
    });
    setShowEditModal(true);
  };

  // Edit or Create blog
  const handleSaveBlog = async (e) => {
    e.preventDefault();

    try {
      const isCreating = !editingBlog._id;
      
      const endpoint = isCreating
        ? `${backendUrl}/api/admin/create-blog`
        : `${backendUrl}/api/admin/edit-blog`;

      const payload = isCreating
        ? {
            title: editingBlog.title,
            content: editingBlog.content,
            category: editingBlog.category,
            excerpt: editingBlog.excerpt,
            status: editingBlog.status,
          }
        : {
            blogId: editingBlog._id,
            updateData: {
              title: editingBlog.title,
              content: editingBlog.content,
              category: editingBlog.category,
              excerpt: editingBlog.excerpt,
              status: editingBlog.status,
            },
          };

      const { data } = await axios.post(endpoint, payload, {
        headers: { atoken: aToken },
      });

      if (data.success) {
        toast.success(
          isCreating ? "Blog created successfully!" : "Blog updated successfully!"
        );
        if (activeTab === "pending") {
          fetchPendingPosts();
        } else {
          fetchAllBlogs();
        }
        setShowEditModal(false);
        setEditingBlog(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save blog");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      case "published":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const displayPosts = activeTab === "pending" ? pendingPosts : blogs;

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center p-4 md:p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3 mt-4">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center p-4 md:p-6 bg-gray-50 rounded-lg">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header with Create Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Manage Blog Posts
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Create New Blog
            </button>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
              {pendingPostsCount} Pending
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "all"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Posts ({blogs?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "pending"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Pending Review ({pendingPostsCount})
          </button>
        </div>

        {/* Blog Posts List */}
        {displayPosts?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <FileText className="size-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Posts Found
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === "pending"
                ? "All blog posts have been reviewed."
                : "No blog posts available yet."}
            </p>
            {activeTab === "all" && (
              <button
                onClick={openCreateModal}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Create Your First Blog Post
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {Array.isArray(displayPosts) && displayPosts.map((post) => (
            // {displayPosts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {post.imageUrl && (
                    <div className="lg:w-48 lg:flex-shrink-0">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-32 lg:h-40 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {post.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          post.status
                        )}`}
                      >
                        {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {post.excerpt ||
                        post.content.replace(/<[^>]*>/g, "").substring(0, 200) +
                          "..."}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{post.author || "Admin"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {formatDate(post.submittedAt || post.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText size={14} />
                        <span className="capitalize">
                          {post.category?.replace("-", " ") || "General"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          setShowDetailsModal(true);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        title="View full post"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      {activeTab === "pending" && (
                        <>
                          <button
                            onClick={() => handleReview("approve", post)}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                            title="Approve and publish"
                          >
                            <Check size={16} />
                            Approve
                          </button>

                          <button
                            onClick={() => handleReview("reject", post)}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            title="Reject this post"
                          >
                            <X size={16} />
                            Reject
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => openEditModal(post)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        title="Edit blog post"
                      >
                        <Edit size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteBlog(post._id, post.title)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete permanently"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              ))}

            
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedPost.title}
                  </h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                {selectedPost.imageUrl && (
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="prose max-w-none">
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: selectedPost.content,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Blog Modal */}
      <AnimatePresence>
        {showEditModal && editingBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingBlog._id ? "Edit Blog Post" : "Create New Blog Post"}
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBlog(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveBlog} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editingBlog.title}
                    onChange={(e) =>
                      setEditingBlog({ ...editingBlog, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="Enter blog title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Category *
                  </label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="mental-health">Mental Health</option>
                    <option value="wellness">Wellness</option>
                    <option value="therapy">Therapy</option>
                    <option value="mindfulness">Mindfulness</option>
                    <option value="anxiety">Anxiety</option>
                    <option value="depression">Depression</option>
                    <option value="self-care">Self Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Excerpt (Short Description)
                  </label>
                  <textarea
                    value={editingBlog.excerpt}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        excerpt: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
                    placeholder="Brief summary of the blog post..."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Content *
                  </label>
                  <textarea
                    value={editingBlog.content.replace(/<[^>]*>/g, "")}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        content: e.target.value,
                      })
                    }
                    rows="12"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
                    placeholder="Write your blog content here..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Status
                  </label>
                  <select
                    value={editingBlog.status}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="published">Published</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    {editingBlog._id ? "Save Changes" : "Create Blog"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingBlog(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogPosts;


