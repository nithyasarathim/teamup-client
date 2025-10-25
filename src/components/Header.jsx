import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  List, Bell, BellRing, X, SquareKanban, SquareMousePointer, LayoutDashboard, CalendarSearch, RefreshCcwDot
} from 'lucide-react';
import Logo from '../assets/logo.png';
import UserContext from '../context/UserContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import Profile from '../assets/default.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

const sidePanelVariants = {
  hidden: (direction) => ({ x: direction === 'left' ? '-100%' : '100%', opacity: 0 }),
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: (direction) => ({ x: direction === 'left' ? '-100%' : '100%', opacity: 0, transition: { duration: 0.3 } }),
};

const Header = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = user?.id || '';

  const [isListOpen, setListOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const profileRef = useRef();

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/notify/${userId}`);
      const data = await res.json();
      const sorted = (data || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setNotifications(sorted);
    } catch (err) {}
  };

  const handleAccept = async (note) => {
    try {
      const res = await fetch(`${API_URL}/notify/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Id: userId,
          notificationId: note._id,
          userName: note.username,
          userId: note.userId,
          projectId: note.projectId,
          role: note.role
        }),
      });
      const data = await res.json();
      toast.info(
        data.message === 'User is already a team member'
          ? `${note.username} is already a member of the project as ${note.role}`
          : `${note.username} has been added to the project as ${note.role}`
      );
      fetchNotifications();
    } catch (err) {}
  };

  const handleReject = async (note) => {
    try {
      await fetch(`${API_URL}/notify/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: note._id, userId }),
      });
      toast.info("Notification deleted successfully");
      fetchNotifications();
    } catch (err) {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  // Close profile on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/events", icon: <CalendarSearch size={20} />, label: "Events" },
    { to: "/explore-projects", icon: <SquareMousePointer size={20} />, label: "Explore" },
    { to: "/projects", icon: <SquareKanban size={20} />, label: "Projects" },
  ];

  const isDigestRoute = location.pathname.startsWith("/events");

  return (
    <div className='w-full'>
      <div className='justify-between flex items-center p-4 relative'>
        <img src={Logo} alt='Logo' className='h-11 m-0' />

        {/* Desktop Nav Links */}
        <div className='navLinks h-12 center items-center px-3 rounded-xl gap-6 hidden md:flex'>
          {navLinks.map(({ to, icon, label }) => (
            <div
              key={to}
              className={`flex items-center gap-1 cursor-pointer text-sm duration-300 ${
                (to === "/events" && isDigestRoute)
                  ? "text-sky-500"
                  : location.pathname === to
                  ? "text-sky-500"
                  : "text-black hover:text-sky-700"
              }`}
              onClick={() => navigate(to)}
            >
              {icon}<p>{label}</p>
            </div>
          ))}
        </div>

        {/* Icons */}
        <div className='flex w-fit items-center gap-5 mx-5 bg-sky-100 p-1 px-2 rounded-lg'>
          <List size={20} className='md:hidden cursor-pointer' onClick={() => setListOpen(true)} />

          <div className='relative cursor-pointer' onClick={() => setNotificationOpen(true)}>
            {notifications.length > 0 ? <BellRing size={20} /> : <Bell size={20} />}
            {notifications.length > 0 && (
              <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full'>
                {notifications.length}
              </span>
            )}
          </div>

          <div
            className='rounded-full h-10 w-10 bg-sky-800 cursor-pointer profile-button'
            onClick={() => setProfileOpen(true)}
          >
            <img src={Profile} alt='Profile' className='rounded-full w-full h-full object-cover' />
          </div>
        </div>

        {/* Side Panel (Mobile Nav) */}
        <AnimatePresence>
          {isListOpen && (
            <>
              <motion.div
                className='fixed inset-0 bg-[#00000090] z-40'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setListOpen(false)}
              />
              <motion.div
                className='w-64 h-full bg-white p-4 shadow-lg fixed left-0 top-0 flex flex-col gap-4 z-50'
                custom='left'
                variants={sidePanelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={e => e.stopPropagation()}
              >
                <X size={24} className='cursor-pointer self-end' onClick={() => setListOpen(false)} />
                {navLinks.map(({ to, icon, label }) => (
                  <div
                    key={to}
                    className={`flex items-center gap-1 cursor-pointer text-sm duration-300 ${
                      (to === "/events" && isDigestRoute)
                        ? "text-sky-500 animate-pulse"
                        : location.pathname === to
                        ? "text-sky-500"
                        : "text-black hover:text-sky-700"
                    }`}
                    onClick={() => { navigate(to); setListOpen(false); }}
                  >
                    {icon}<p>{label}</p>
                  </div>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Notifications Panel */}
        <AnimatePresence>
          {isNotificationOpen && (
            <>
              <motion.div
                className='fixed inset-0 bg-[#00000090] z-40'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setNotificationOpen(false)}
              />
              <motion.div
                className='min-w-[350px] w-[25%] h-full bg-white p-4 shadow-lg fixed right-0 top-0 flex flex-col gap-4 z-50'
                custom='right'
                variants={sidePanelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={e => e.stopPropagation()}
              >
                <X size={24} className='cursor-pointer self-end' onClick={() => setNotificationOpen(false)} />
                <div className='flex justify-between items-center'>
                  <h2 className='text-lg font-semibold'>Notifications</h2>
                  <motion.button
                    className='text-xs bg-sky-500 mr-4 text-white rounded-full hover:bg-sky-700 duration-300'
                    whileTap={{ rotate: 180 }}
                    onClick={e => { e.stopPropagation(); fetchNotifications(); }}
                  >
                    <RefreshCcwDot size={16} className='inline m-1' />
                  </motion.button>
                </div>

                {notifications.length > 0 ? (
                  <div className='flex flex-col gap-2 overflow-y-auto'>
                    {notifications.map((note, index) => (
                      <motion.div
                        key={index}
                        className='p-3 border border-gray-300 shadow-xs rounded bg-white'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <p className='text-sm font-medium text-black mb-2'>
                          <span className='text-sky-600 font-semibold hover:cursor-pointer' onClick={()=>navigate(`/profile/${note.userId}`)}>{note.username}</span> has requested to join the <span className='text-sky-600 font-semibold'>{note.projectName}</span> project as a <span className='text-sky-600 font-semibold'>{note.role}</span>. Would you like to approve the request?
                        </p>
                        <p className='text-xs text-gray-500 italic'>{new Date(note.timestamp).toLocaleString()}</p>
                        <div className='flex gap-3 mt-2 justify-end'>
                          <motion.button 
                            whileTap={{ scale: 0.95 }} 
                            className='bg-green-300 hover:bg-green-600 duration-400 text-green-900 text-xs font-semibold px-3 py-1 rounded'
                            onClick={() => handleAccept(note)}
                          >
                            Accept
                          </motion.button>
                          <motion.button 
                            whileTap={{ scale: 0.95 }} 
                            className='bg-red-300 hover:bg-red-600 duration-200 text-red-900 text-xs font-semibold px-3 py-1 rounded'
                            onClick={() => handleReject(note)}
                          >
                            Decline
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className='text-sm text-gray-500'>No new notifications</div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Profile Modal */}
        <AnimatePresence>
          {isProfileOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-[#00000020] z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setProfileOpen(false)}
              />
              <motion.div
                ref={profileRef}
                className="profile-modal absolute top-16 right-6 bg-white shadow-md rounded-xl z-50 p-3 flex flex-col gap-2 min-w-[100px]"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="text-left px-3 py-1 text-sm text-gray-800 hover:text-black rounded"
                  onClick={() => { navigate('/profile/'+userId); setProfileOpen(false); }}
                >
                  Profile
                </button>
                <button
                  className="text-left px-3 py-1 text-sm text-red-500 hover:text-red-600 rounded"
                  onClick={() => { setProfileOpen(false); localStorage.removeItem("token"); window.location.reload(); }}
                >
                  Log Out
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Header;
