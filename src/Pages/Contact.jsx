import { frameData, motion } from "framer-motion";
import { use, useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import axiosPublic from "../api/axiosPublic";
import { AuthContext } from "../Context/AuthContext";

const ContactUs = () => {
    const {user} = use(AuthContext)
  const [formData, setFormData] = useState({ name: user?.displayName || "", // Pre-fill name
  email: user?.email || "",      // Pre-fill email
  message: "", });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const { name, email, message } = formData;
    if (!name || !email || !message) return setError("All fields are required");

    try {
      setLoading(true);
      await axiosPublic.post("/api/contact", formData);
      setSuccess("Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className=" min-h-screen">
      {/* Hero Header */}
      <div className=" py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-6 text-center"
        >
          <h1 className="text-5xl font-extrabold text-base-content mb-4">Let's Connect</h1>
          <p className="text-lg opacity-80 max-w-xl mx-auto">
            Have a question about ClubSphere? We're here to help you build your community.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card  p-8 shadow-xl ">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <ContactLink icon={<FaEnvelope className="text-gray-500"/>} title="Email Us" detail="support@clubsphere.com" />
                <ContactLink icon={<FaPhoneAlt className="text-gray-500"/>} title="Call Us" detail="+880 1234 567 890" />
                <ContactLink icon={<FaMapMarkerAlt className="text-gray-500"/>} title="Visit Us" detail="Dhaka, Bangladesh" />
              </div>
            </div>

            {/* Simple FAQ Section */}
            <div className="card bg-base-200 p-6 border border-primary/10">
              <h4 className="font-bold mb-4">Quick FAQ</h4>
              <div className="collapse collapse-plus bg-base-100 mb-2">
                <input type="radio" name="my-accordion-3" defaultChecked /> 
                <div className="collapse-title font-medium">Response time?</div>
                <div className="collapse-content text-sm">Usually within 24 hours.</div>
              </div>
              <div className="collapse collapse-plus bg-base-100">
                <input type="radio" name="my-accordion-3" /> 
                <div className="collapse-title font-medium">Support hours?</div>
                <div className="collapse-content text-sm">Mon-Fri: 9am to 6pm.</div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 card bg-base-100 shadow-2xl border border-primary/10 p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label font-semibold">Name:</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="input input-bordered focus:border-primary rounded-2xl ml-2" />
                </div>
                <div className="form-control">
                  <label className="label font-semibold">Email: </label>
                  <input type="email" name="email" value={frameData.email} onChange={handleChange} placeholder="john@example.com" className="input input-bordered focus:border-primary rounded-2xl ml-2" />
                </div>
              </div>
              <div className="form-control">
                <label className="label font-semibold">Message: </label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={5} className="textarea textarea-bordered rounded-2xl focus:border-primary ml-2" placeholder="How can we help?" />
              </div>

              {error && <div className="alert alert-error text-sm">{error}</div>}
              {success && <div className="alert alert-success text-sm">{success}</div>}

              <button disabled={loading} className="btn btn-primary text-gray-800 w-full text-lg mt-4">
                {loading ? <span className="loading loading-spinner"></span> : <><FaPaperPlane /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Map Section */}
        <div className="my-24">
          <h2 className="text-3xl font-bold mb-8 text-center text-base-content">Find Us on the Map</h2>
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 h-[450px]">
            <iframe
              title="ClubSphere Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.27295181635!2d90.37586224161483!3d23.74494584148011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b1fd000001%3A0x3d0e251861115049!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper Component for Info
const ContactLink = ({ icon, title, detail }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 bg-primary text-primary-content rounded-lg shadow-md">{icon}</div>
    <div>
      <h4 className="font-bold text-sm uppercase opacity-60 tracking-wider">{title}</h4>
      <p className="text-lg">{detail}</p>
    </div>
  </div>
);

export default ContactUs;