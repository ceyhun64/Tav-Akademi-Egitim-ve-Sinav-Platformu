import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAnnouncementByUser } from "../../../features/thunks/announcementThunk";

export default function Announcement() {
  const dispatch = useDispatch();
  const { userAnnouncements } = useSelector((state) => state.announcement);

  useEffect(() => {
    dispatch(fetchAnnouncementByUser());
  }, [dispatch]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "2rem auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9fbff",
        borderRadius: "14px",
        boxShadow: "0 12px 30px rgba(0, 27, 102, 0.1)",
      }}
    >
      {userAnnouncements.length === 0 && (
        <p
          style={{
            fontSize: "1.15rem",
            textAlign: "center",
            color: "#555",
            fontWeight: "500",
          }}
        >
          Henüz duyuru yok.
        </p>
      )}

      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        {userAnnouncements.map((announcement) => (
          <li
            key={announcement.id}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "1.25rem 1.75rem",
              boxShadow: "0 8px 24px rgba(0, 27, 102, 0.08)",
              marginBottom: "1.5rem",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 16px 40px rgba(0, 27, 102, 0.15)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(0, 27, 102, 0.08)";
              e.currentTarget.style.transform = "none";
            }}
          >
            <p
              style={{
                fontWeight: "700",
                fontSize: "1.15rem",
                marginBottom: "0.6rem",
                color: "#001b66",
                lineHeight: "1.4",
                userSelect: "text",
              }}
            >
              {announcement.content}
            </p>
            <small
              style={{
                color: "#7a7a7a",
                fontSize: "0.9rem",
                userSelect: "none",
              }}
            >
              Yayınlanma Tarihi: {formatDate(announcement.createdAt)}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
