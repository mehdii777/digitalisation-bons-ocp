"use client";
import { useEffect, useState, useRef } from "react";
import { Bell, X } from "lucide-react";
import { listenForBonUpdates } from "@/sanity/lib/client";

const Notification = ({session}) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const currentUsername = session?.user?.name;
  const notificationRef = useRef(null);

  // On component mount, load saved notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem("userNotifications");
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Set up real-time listener for new notifications
  useEffect(() => {
    if (!currentUsername) return;

    const subscription = listenForBonUpdates((notifText, resultData) => {
      // Now we can directly check if the notification was triggered by the current user
      if (resultData && resultData.user === currentUsername) {
        console.log("Skipping self-notification:", notifText);
        return;
      }
      
      setNotifications((prev) => {
        const updatedNotifs = [{ id: Date.now(), text: notifText }, ...prev];
        localStorage.setItem("userNotifications", JSON.stringify(updatedNotifs));
        return updatedNotifs;
      });
    });

    return () => subscription?.unsubscribe();
  }, [currentUsername]);

  // Handle clicks outside the notification panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleNotifications = () => setIsOpen(!isOpen);

  const deleteNotification = (id) => {
    setNotifications((prev) => {
      const updatedNotifs = prev.filter((notif) => notif.id !== id);
      localStorage.setItem("userNotifications", JSON.stringify(updatedNotifs));
      return updatedNotifs;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("userNotifications");
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button 
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors" 
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-800" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border shadow-lg rounded-md p-2 z-50">
          <div className="flex justify-between items-center border-b">
            <h3 className="font-medium text-gray-900 px-2 py-1">Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={clearAllNotifications}
                className="text-xs text-gray-500 hover:text-red-500 px-2"
              >
                Tout effacer
              </button>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className="text-sm text-gray-700 p-2 border-b last:border-b-0 hover:bg-gray-50 flex justify-between items-center"
                >
                  <span>{notif.text}</span>
                  <button 
                    onClick={() => deleteNotification(notif.id)} 
                    className="text-gray-400 hover:text-red-500 p-1"
                    aria-label="Delete notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 p-4 text-center">
                Aucune notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;