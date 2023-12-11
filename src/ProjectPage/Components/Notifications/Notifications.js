import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";

import { FaBell, FaRegBell, FaCircle, FaRegCircle } from "react-icons/fa6";
import { MdOutlineMarkChatRead } from "react-icons/md";

import "./Notifications.scss";

/**
 * Component to display user notifications.
 */
const Notifications = () => {
  const userId = useSelector((state) => state.auth.user.user_id);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const dropdownRef = useRef(null);

  const [notifications, setNotifications] = useState([]);

  /**
   * Fetches notifications for the user.
   * @async
   */
  const fetchNotification = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3333/users/get_notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );
      if (response.ok && response.status !== 201) {
        const notifications = await response.json();
        const fetchedNotifications = notifications.map((notification) => ({
          notification_id: notification.notification_id,
          notification_text: notification.notification_text,
          is_read: notification.is_read,
          date: notification.creation_date,
        }));
        setNotifications(fetchedNotifications);
      } else if (response.status === 201) {
        setNotifications([]);
      } else {
        console.error("Erreur lors de la récupération des notifications");
      }
    } catch (error) {
      console.error("Erreur de réseau ou autre erreur", error);
    }
  }, [userId]);

  /**
   * Marks a specific notification as read.
   * @param {string} notification_id - ID of the notification to mark as read.
   * @async
   */
  async function readNotification(notification_id) {
    const updatedNotifications = notifications.map((notification) => {
      if (notification.notification_id === notification_id) {
        return { ...notification, is_read: true };
      }
      return notification;
    });

    setNotifications(updatedNotifications);

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3333/users/read_notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            notification_id: notification_id,
          }),
        }
      );
      if (response.ok) {
        console.log("GJ");
      } else {
        // Handle response errors
        console.error("Failed to read (u gotta be kidding)");
      }
    } catch (error) {
      console.log("Wtf have u done ?");
    }
  }

  /**
   * Marks all notifications as read.
   * @async
   */
  async function readAllNotifications() {
    setNotifications(
      notifications.map((notification) => ({ ...notification, is_read: true }))
    );

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3333/users/read_all_notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );
      if (response.ok) {
        console.log("GJ");
      } else {
        // Handle response errors
        console.error("Failed to read all (u gotta be kiddingx2)");
      }
    } catch (error) {
      console.log("Wtf have u done ?");
    }
  }

  /**
   * Closes the notification dropdown if clicked outside.
   * @param {Event} event - The triggered click event.
   */
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    // Event listener for closing dropdown
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Polling for notifications
    fetchNotification();
    const interval = setInterval(fetchNotification, 10000);
    return () => clearInterval(interval);
  }, [fetchNotification]);

  return (
    <div className="n-notifications_container">
      {dropdownOpen ? (
        <>
          <FaBell onClick={toggleDropdown} className="n-notifications_icon" />
          {notifications.some((notification) => !notification.is_read) ? (
            <FaCircle className="n-notification_circle" />
          ) : null}
        </>
      ) : (
        <>
          <FaRegBell
            onClick={toggleDropdown}
            className="n-notifications_icon"
          />
          {notifications.some((notification) => !notification.is_read) ? (
            <FaCircle className="n-notification_circle" />
          ) : null}
        </>
      )}

      {dropdownOpen && (
        <div ref={dropdownRef} className="n-notification-dropdown">
          <div className="n-notifications_title">
            Notifications
            <MdOutlineMarkChatRead
              className="n-mark_read"
              onClick={() => {
                readAllNotifications();
              }}
            />
          </div>
          <hr className="n-separator_notifications" />
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <>
                <div
                  key={index}
                  className="n-notification_item"
                  onClick={() => {
                    notification.is_read = true;
                    readNotification(notification.notification_id);
                  }}
                >
                  {notification.is_read ? (
                    <FaRegCircle className="n-notification_status" />
                  ) : (
                    <FaCircle className="n-notification_status_active" />
                  )}
                  {notification.notification_text}
                </div>
              </>
            ))
          ) : (
            <div className="n-align_clear">
              <p>All clear !</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
