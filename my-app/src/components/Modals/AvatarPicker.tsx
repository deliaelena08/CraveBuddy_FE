import React from 'react';
import './AvatarPicker.css';

interface AvatarPickerProps {
  avatars: string[];
  onSelect: (avatar: string) => void;
  onClose: () => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ avatars, onSelect, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select your avatar</h2>
        <div className="avatar-grid">
          {avatars.map((avatar, idx) => (
            <img
              key={idx}
              src={avatar}
              alt={`avatar-${idx}`}
              onClick={() => onSelect(avatar)}
              className="avatar-option"
            />
          ))}
        </div>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};
