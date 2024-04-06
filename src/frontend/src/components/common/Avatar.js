import React from "react";
import { Link } from "../../lib/rrfs/index.js";

const Avatar = ({ src, alt, to, isEditing = false, onImageUploadClick = null, diameter, onlineStatus = "None" }) => {
  const getImageSrc = (src) => {
    // todo: process.env.ASSETS_URL값이 존재하나 유효하지 않은 경우 처리
    if (!process.env.ASSETS_URL) return;
    if (!src || src === "") return `${process.env.ASSETS_URL}/images/default-avatar.jpg`;
    return `${process.env.AVATAR_BASE_URL}/images/avatar/${src}`;
  };

  const handleImageLoadFailed = (e) => {
    if (!process.env.ASSETS_URL) return;
    e.target.src = `${process.env.ASSETS_URL}/images/loading-failed.png`;
  };

  const renderImage = () => (
    <img
      src={getImageSrc(src)}
      alt={alt || "아바타 이미지"}
      className="avatar-img rounded-circle"
      style={{ width: `${diameter}px`, height: `${diameter}px` }}
      onError={handleImageLoadFailed}
    />
  );

  const renderOnlineStatusIndicator = () => {
    if (onlineStatus !== "online" && onlineStatus !== "offline") return null;
    return <span className={`online-indicator ${onlineStatus}`}></span>;
  };

  return (
    <div className="avatar" style={diameter ? { width: `${diameter}px`, height: `${diameter}px` } : null}>
      {to ? <Link to={to}>{renderImage()}</Link> : renderImage()}
      {isEditing && (
        <button onClick={onImageUploadClick} className="edit-button">
          <i className="fas fa-edit edit-icon"></i>
        </button>
      )}
      {renderOnlineStatusIndicator()}
    </div>
  );
};

export default Avatar;
