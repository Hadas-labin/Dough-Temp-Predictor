
import React, { useState , FormEvent} from 'react';
import './AdminLoginModal.css'; 

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AdminLoginModal({ onClose, onSuccess }:AdminLoginModalProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:8000/admin/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('admin_token', data.access_token);
                setSuccess(true);
                setTimeout(() => {
                    onSuccess?.();
                    onClose();
                }, 1000);
            } else {
                setError(data.detail || 'שגיאה בהתחברות');
            }
        } catch (err) {
            setError('שגיאה בחיבור לשרת');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>כניסת מנהל</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">שם משתמש:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                            placeholder="הכנס שם משתמש"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">סיסמה:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            placeholder="הכנס סיסמה"
                        />
                    </div>

                    {error && <div className="error-msg">{error}</div>}
                    {success && <div className="success-msg">התחברת בהצלחה!</div>}

                    <div className="form-actions">
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? <span className="ai-loader"></span> : 'כניסה'}
                        </button>
                        <button type="button" className="cancel-button" onClick={onClose} disabled={isLoading}>
                            ביטול
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

