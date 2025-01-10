import React, { useState } from 'react';
import useUser from '../../hooks/useUser'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../ui/User.css'; 

function UserPage() {
  const { user } = useUser(); 
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async () => {
    try {
      const response = await fetch('/api/password', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          password 
        }),
      });
  
      if (!response.ok) {
        throw new Error('Не удалось изменить пароль');
      }
  
      const data = await response.json();
      setSuccess(data.message); 
      setPassword(''); 
      setShowModal(false); 
    } catch (error) {
      setError(error.message); 
    }
  };

  return (
    <div className="container-fluid mt-2">
      <div className="card" style={{ width: '290px' }}> 
        <div className="card-body text-left"> 
          {user.status === 'logged' ? (
            <div>
              <p className="card-text fw-bold h5">Имя: {user.user.firstName} {user.user.lastName}</p>
              <p className="card-text fw-bold h5">Email: {user.user.email}</p>
              <button className="btn btn-primary mt-3" onClick={() => setShowModal(true)}>
                Изменить пароль
              </button>
            </div>
          ) : (
            <p className="text-muted fw-bold h5">Гость</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal show" style={{ display: 'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Изменение пароля</h5>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <div className="form-group">
                  <label htmlFor="password">Новый пароль</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите новый пароль"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Закрыть
                </button>
                <button type="button" className="btn btn-primary" onClick={handleChangePassword}>
                  Сохранить изменения
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;
