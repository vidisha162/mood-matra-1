
import React, { useContext, useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import { Check, SquareCheckBig, Video, Image, Edit, Trash2, X } from "lucide-react";
import { AdminContext } from "@/context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [docVideo, setDocVideo] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        // { headers: { aToken } }
        // { headers: { Authorization: `Bearer ${aToken}` } }
        { headers: { atoken: aToken } }
      );
      setDoctorList(data.doctors || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch doctors");
    }
  };

  useEffect(() => {
    if (aToken) {
      fetchDoctors();
    }
  }, [aToken]);

  // Delete doctor
  const handleDeleteDoctor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete Dr. ${name}?`)) return;
    
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/delete-doctor`,
        { doctorId: id },
        // 
        
        // { headers: { Authorization: `Bearer ${aToken}` } }
        { headers: { atoken: aToken } }

      );
      
      if (data.success) {
        toast.success(data.message);
        fetchDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete doctor");
    }
  };

  // Open edit modal
  const openEditModal = (doctor) => {
    setEditingDoctor({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      speciality: doctor.speciality,
      degree: doctor.degree,
      experience: doctor.experience,
      fees: doctor.fees,
      about: doctor.about,
      address1: doctor.address?.line1 || "",
      address2: doctor.address?.line2 || "",
      available: doctor.available,
    });
    setShowEditModal(true);
  };

  // Edit doctor
  const handleEditDoctor = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/edit-doctor`,
        {
          doctorId: editingDoctor._id,
          updateData: {
            name: editingDoctor.name,
            speciality: editingDoctor.speciality,
            degree: editingDoctor.degree,
            experience: editingDoctor.experience,
            fees: editingDoctor.fees,
            about: editingDoctor.about,
            address: {
              line1: editingDoctor.address1,
              line2: editingDoctor.address2,
            },
            available: editingDoctor.available,
          },
        },
        // { headers: { aToken } }
        // { headers: { Authorization: `Bearer ${aToken}` } }
        { headers: { atoken: aToken } }

      );

      if (data.success) {
        toast.success(data.message);
        fetchDoctors();
        setShowEditModal(false);
        setEditingDoctor(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update doctor");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (!docImg) {
        return toast.error("Image Not Selected");
      }

      const formData = new FormData();
      formData.append("image", docImg);
      if (docVideo) {
        formData.append("video", docVideo);
      }
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        {
          // headers: {
          //   Authorization: `Bearer ${aToken}`,
          //   "Content-Type": "multipart/form-data",
          // },
          headers: {
          atoken: aToken,
          "Content-Type": "multipart/form-data",
}
        }
      );

      if (data.success) {
        toast.success(data.message);
        // Clear form
        setDocImg(null);
        setDocVideo(null);
        setName("");
        setPassword("");
        setEmail("");
        setAddress1("");
        setAddress2("");
        setDegree("");
        setAbout("");
        setFees("");
        setExperience("");
        setSpeciality("");
        // Refresh list
        fetchDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      toast.error(errorMessage);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      name &&
      email &&
      password &&
      experience &&
      fees &&
      about &&
      speciality &&
      degree &&
      address1 &&
      address2 &&
      docImg
    );
  };

  return (
    <div className="w-full">
      {/* Add Doctor Form */}
      <form
        onSubmit={onSubmitHandler}
        className="m-2 w-full max-w-[800px] flex flex-col items-center sm:items-start justify-center gap-4 p-4 bg-gray-50 rounded"
      >
        <p className="text-2xl sm:text-3xl font-semibold tracking-wide text-primary">
          Add New Doctor
        </p>

        <div className="flex flex-col items-center sm:items-start justify-center gap-4 w-full">
          {/* File Upload Section */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Image Upload */}
            <div>
              <label htmlFor="doc-img">
                <div className="min-w-44 p-2.5 rounded border border-gray-300 bg-gray-100 text-gray-500 flex flex-col items-center justify-center gap-2 cursor-crosshair active:scale-[95%] transition-all duration-75 ease-in">
                  <div className="relative">
                    <img
                      className="w-32 h-32 sm:w-24 sm:h-24 rounded-full border border-gray-300 object-cover"
                      src={
                        docImg ? URL.createObjectURL(docImg) : assets.upload_area
                      }
                      alt="Doctor profile"
                    />
                    <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                      <Image size={16} />
                    </div>
                  </div>
                  <p className="flex items-center justify-center gap-2">
                    {docImg ? "Image Uploaded" : "Upload Photo"}
                    {docImg && <Check size={18} className="text-primary" />}
                  </p>
                </div>
              </label>
              <input
                onChange={(e) => setDocImg(e.target.files[0] || null)}
                type="file"
                id="doc-img"
                accept="image/*"
                hidden
              />
            </div>

            {/* Video Upload */}
            <div>
              <label htmlFor="doc-video">
                <div
                  className={`min-w-44 p-2.5 rounded border border-gray-300 ${
                    docVideo ? "bg-gray-100" : "bg-gray-50"
                  } text-gray-500 flex flex-col items-center justify-center gap-2 cursor-crosshair active:scale-[95%] transition-all duration-75 ease-in`}
                >
                  <div className="relative">
                    {docVideo ? (
                      <video className="w-32 h-32 sm:w-24 sm:h-24 rounded border border-gray-300 object-cover">
                        <source
                          src={URL.createObjectURL(docVideo)}
                          type={docVideo.type}
                        />
                      </video>
                    ) : (
                      <div className="size-32 sm:size-24 rounded border border-gray-300 bg-gray-100 flex items-center justify-center">
                        <Video size={32} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                      <Video size={16} />
                    </div>
                  </div>
                  <p className="flex items-center justify-center gap-2">
                    {docVideo ? "Video Uploaded" : "Upload Intro Video"}
                    {docVideo && <Check size={18} className="text-primary" />}
                  </p>
                </div>
              </label>
              <input
                onChange={(e) => setDocVideo(e.target.files[0]||null)}
                type="file"
                id="doc-video"
                accept="video/*"
                hidden
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-start items-start gap-4 sm:gap-20 text-gray-600">
            <div className="flex flex-col items-start justify-center gap-4">
              <div className="flex flex-col items-stretch gap-1">
                <p>Name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="px-2.5 py-2 w-[80vw] sm:w-80 placeholder:text-gray-400 tracking-wide font-normal rounded border border-gray-300 bg-gray-100"
                  type="text"
                  placeholder="Fullname"
                  required
                />
              </div>

              <div className="flex flex-col items-stretch gap-1">
                <p>Email</p>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="px-2.5 py-2 w-[80vw] sm:w-80 placeholder:text-gray-400 tracking-wide font-normal rounded border border-gray-300 bg-gray-100"
                  type="email"
                  placeholder="Email Id"
                  required
                />
              </div>

              <div className="flex flex-col items-stretch gap-1">
                <p>Password</p>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="px-2.5 py-2 w-[80vw] sm:w-80 placeholder:text-gray-400 tracking-wide font-normal rounded border border-gray-300 bg-gray-100"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>

              <div className="flex flex-col w-full items-stretch gap-1">
                <p>Experience</p>
                <select
                  onChange={(e) => setExperience(e.target.value)}
                  value={experience}
                  className="px-2.5 py-2 w-[80vw] sm:w-80 placeholder:text-gray-400 tracking-wide font-normal rounded border border-gray-300 bg-gray-100 appearance-none"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={`${i + 1} Year${i > 0 ? "s" : ""}`}>
                      {i + 1} Year{i > 0 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col items-stretch gap-1">
                <p>Appointment Fees</p>
                <input
                  onChange={(e) => setFees(e.target.value)}
                  value={fees}
                  className="px-2.5 py-2 w-[80vw] sm:w-80 placeholder:text-gray-400 tracking-wide font-normal rounded border border-gray-300 bg-gray-100"
                  type="number"
                  placeholder="₹₹"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col items-start justify-center gap-4">
              <div className="flex flex-col w-full items-stretch gap-1">
                <p>Speciality</p>
                <select
                  onChange={(e) => setSpeciality(e.target.value)}
                  value={speciality}
                  className="px-2.5 py-2 w-[80vw] sm:w-80 placeholder:text-gray-400 tracking-wide font-normal rounded border border-gray-300 bg-gray-100 appearance-none"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Psychiatrists">Psychiatrists</option>
                  <option value="Clinical Psychologists">
                    Clinical Psychologist
                  </option>
                  <option value="Therapists">Therapist</option>
                  <option value="Child and Adolescent Psychiatrists">
                    Child & Adolescent Psychiatrists
                  </option>
                  <option value="Geriatric Psychiatrists">
                    Geriatric Psychiatrists
                  </option>
                  <option value="Addiction Psychiatrists">
                    Addiction Psychiatrist
                  </option>
                </select>
              </div>

              <div className="flex flex-col w-full items-stretch gap-1">
                <p>Education</p>
                <input
                  onChange={(e) => setDegree(e.target.value)}
                  value={degree}
                  className="px-2.5 py-2 w-[80vw] sm:w-80 placeholder:text-gray-400 tracking-wide font-normal rounded border border-gray-300 bg-gray-100"
                  type="text"
                  placeholder="Degree"
                  required
                />
              </div>

              <div className="flex flex-col w-full items-stretch gap-1">
                <p>Address</p>
                <input
                  onChange={(e) => setAddress1(e.target.value)}
                  value={address1}
                  className="px-2.5 py-2 w-[80vw] sm:w-80 placeholder:text-gray-400 tracking-wide font-normal rounded border border-gray-300 bg-gray-100"
                  type="text"
                  placeholder="Line 1"
                  required
                />
                <input
                  onChange={(e) => setAddress2(e.target.value)}
                  value={address2}
                  className="px-2.5 py-2 w-[80vw] sm:w-80 placeholder:text-gray-400 tracking-wide font-normal rounded border border-gray-300 bg-gray-100"
                  type="text"
                  placeholder="Line 2"
                  required
                />
              </div>

              <div className="flex flex-col items-stretch gap-1 w-full">
                <p>About</p>
                <textarea
                  onChange={(e) => setAbout(e.target.value)}
                  value={about}
                  placeholder="Write a description to highlight the physician's approach"
                  required
                  className="px-2.5 py-2 w-[80vw] sm:w-80 placeholder:text-gray-400 tracking-wide font-normal rounded border border-gray-300 bg-gray-100 h-28 sm:h-[82px] resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center sm:justify-end w-[93.6%] mt-4">
          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className={`py-3 px-5 rounded w-[50vw] sm:w-fit flex items-center justify-center gap-2 transition-all duration-200 ease-in ${
              !isFormValid() || loading
                ? "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white border border-primary hover:opacity-90 active:scale-[97%]"
            }`}
          >
            <span>{loading ? "Adding..." : "Add Doctor"}</span>
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <SquareCheckBig size={18} />
            )}
          </button>
        </div>
      </form>

      {/* Doctors List */}
      <div className="mt-8 w-full max-w-[1400px] mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          All Doctors ({doctorList.length})
        </h2>
        
        {doctorList.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No doctors added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctorList.map((doc) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = assets.upload_area;
                    }}
                  />
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      doc.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {doc.available ? "Available" : "Unavailable"}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {doc.name}
                  </h3>
                  <p className="text-primary font-semibold text-sm mb-2">
                    {doc.speciality}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">{doc.degree}</p>
                  <p className="text-gray-600 text-sm mb-2">{doc.email}</p>
                  <p className="text-gray-600 text-sm mb-3">
                    Experience: {doc.experience}
                  </p>
                  <p className="text-xl font-bold text-primary mb-4">
                    ₹{doc.fees}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(doc)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doc._id, doc.name)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Doctor
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingDoctor(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleEditDoctor} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingDoctor.name}
                      onChange={(e) =>
                        setEditingDoctor({
                          ...editingDoctor,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingDoctor.email}
                      onChange={(e) =>
                        setEditingDoctor({
                          ...editingDoctor,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Speciality
                    </label>
                    <select
                      value={editingDoctor.speciality}
                      onChange={(e) =>
                        setEditingDoctor({
                          ...editingDoctor,
                          speciality: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      required
                    >
                      <option value="Psychiatrists">Psychiatrists</option>
                      <option value="Clinical Psychologists">
                        Clinical Psychologist
                      </option>
                      <option value="Therapists">Therapist</option>
                      <option value="Child and Adolescent Psychiatrists">
                        Child & Adolescent Psychiatrists
                      </option>
                      <option value="Geriatric Psychiatrists">
                        Geriatric Psychiatrists
                      </option>
                      <option value="Addiction Psychiatrists">
                        Addiction Psychiatrist
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={editingDoctor.degree}
                      onChange={(e) =>
                        setEditingDoctor({
                          ...editingDoctor,
                          degree: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Experience
                    </label>
                    <select
                      value={editingDoctor.experience}
                      onChange={(e) =>
                        setEditingDoctor({
                          ...editingDoctor,
                          experience: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      required
                    >
                      {[...Array(10)].map((_, i) => (
                        <option
                          key={i + 1}
                          value={`${i + 1} Year${i > 0 ? "s" : ""}`}
                        >
                          {i + 1} Year{i > 0 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Fees (₹)
                    </label>
                    <input
                      type="number"
                      value={editingDoctor.fees}
                      onChange={(e) =>
                        setEditingDoctor({
                          ...editingDoctor,
                          fees: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={editingDoctor.address1}
                    onChange={(e) =>
                      setEditingDoctor({
                        ...editingDoctor,
                        address1: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={editingDoctor.address2}
                    onChange={(e) =>
                      setEditingDoctor({
                        ...editingDoctor,
                        address2: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    About
                  </label>
                  <textarea
                    value={editingDoctor.about}
                    onChange={(e) =>
                      setEditingDoctor({
                        ...editingDoctor,
                        about: e.target.value,
                      })
                    }
                    rows="4"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="available"
                    checked={editingDoctor.available}
                    onChange={(e) =>
                      setEditingDoctor({
                        ...editingDoctor,
                        available: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                  <label
                    htmlFor="available"
                    className="text-gray-700 font-semibold"
                  >
                    Available for appointments
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingDoctor(null);
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



export default AddDoctor;