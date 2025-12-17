import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane
} from "react-icons/fa";
import Logo from "./LOgo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-white/5">
      {/* Newsletter / Pre-footer Section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="bg-white/5 rounded-[2.5rem] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 mb-16 border border-white/10">
          <div className="max-w-md">
            <h3 className="text-2xl font-black text-white mb-2">Stay in the loop</h3>
            <p className="text-slate-400">Get weekly digests of new clubs and trending events in your area.</p>
          </div>
          <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-80"
            />
            <button className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
              Subscribe <FaPaperPlane className="text-sm" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-slate-400 leading-relaxed mb-8">
              The premier platform for community discovery. We help you find your 
              people and build lasting connections through shared passions.
            </p>
            <div className="flex flex-wrap gap-3">
              {[FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-white/5"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:ml-auto">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Platform</h4>
            <ul className="space-y-4 font-medium">
              {["Browse Clubs", "Upcoming Events", "Start a Club", "Featured Organizers"].map((link) => (
                <li key={link}>
                  <Link to="/" className="hover:text-primary transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:ml-auto">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Company</h4>
            <ul className="space-y-4 font-medium">
              {["About Us", "Our Mission", "Contact", "Partnerships"].map((link) => (
                <li key={link}>
                  <Link to="/" className="hover:text-primary transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:ml-auto">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <FaMapMarkerAlt className="text-primary mt-1" />
                <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
                  123 Community Plaza,<br />Suite 400, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <FaEnvelope className="text-primary" />
                <a href="mailto:hello@clubsphere.com" className="text-slate-400 group-hover:text-slate-200 transition-colors">
                  hello@clubsphere.com
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <FaPhone className="text-primary" />
                <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
                  +1 (555) 000-1234
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-white/5 bg-slate-1000/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-sm font-medium">
              © {currentYear} ClubSphere. Designed for communities.
            </p>
            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
              <Link to="/" className="text-slate-500 hover:text-white transition-colors">Privacy</Link>
              <Link to="/" className="text-slate-500 hover:text-white transition-colors">Terms</Link>
              <Link to="/" className="text-slate-500 hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;