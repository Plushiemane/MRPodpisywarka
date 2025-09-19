import './App.css'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import logoUrl from './assets/Projekt bez nazwy.png?url';

function getAge(dateString: Date) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function App() {
  const [birthDate, setBirthDate] = useState(new Date());
  const age = useMemo(() => getAge(birthDate), [birthDate]);
  const navigate = useNavigate();

  const handleStart = () => {
    if (age >= 26) {
      window.location.href = 'https://dolacz.partiarazem.pl';
    }
    else if (age > 16) {
      navigate('/over16');
    } else if (age > 14) {
      navigate('/over14');
    }
    
    else {
      alert("Niestety, musisz mieć co najmniej 14 lat, aby podpisać deklarację.");
    }
  };

  return (
    <div className="main_div card">
      <img src={String(logoUrl)} alt="logo" className="site-logo" />
      <h3>Wypełnianie deklaracji do MR</h3>
      <p>Podaj dzień urodzin</p>
      <input type="date" min={new Date(1900, 0, 1).toISOString().split("T")[0]} max={new Date().toISOString().split("T")[0]} value={birthDate.toISOString().split("T")[0]} onChange={(e) => setBirthDate(new Date(e.target.value))} />
      <button className='' onClick={handleStart}>Rozpocznij</button>
    </div>
  );
}

export default App
