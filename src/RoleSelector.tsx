import { useNavigate } from 'react-router-dom';

const RoleSelector = () => {
  const navigate = useNavigate();

  const handleSelect = (selectedRole: string) => {
    localStorage.setItem('role', selectedRole);
    if (selectedRole === 'institute') {
      navigate('/create-battle');
    } else {
      navigate('/participate');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Select Your Role</h2>
      <button onClick={() => handleSelect('institute')}>I am an Institute 🏛️</button>
      <button onClick={() => handleSelect('participant')} style={{ marginLeft: '20px' }}>
        I am a Participant 🎨
      </button>
    </div>
  );
};

export default RoleSelector;
