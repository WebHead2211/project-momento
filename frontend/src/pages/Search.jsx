import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Search.css";

export default function Search() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [results, setResults] = useState();

  const handleChange = async (e) => {
    if (e.target.value !== " ") {
      setText(e.target.value);
    }
  };

  useEffect(() => {
    const getResults = async () => {
      try {
        const response = await axios.get(`/api/v1/users/search/${text}`);
        setResults(response.data.data);
      } catch (error) {
        navigate("/error", { state: { error: error.response.data.error } });
      }
    };
    if (text !== "") {
      getResults();
    } else {
      setResults([]);
    }
  }, [text, navigate]);

  return (
    <>
      <div className="search-page">
        <h1>Search</h1>

        <div>
          <input
            type="text"
            name="search"
            placeholder="Search for users..."
            value={text}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        {results && (
          <>
            {results.map((item, index) => (
              <Link to={`/user/${item.username}`} key={index}>
                <div className="search-result">
                  <div>
                    <img src={item.avatar} alt="" />
                  </div>
                  <div className="search-name">
                    <h3>@{item.username}</h3>
                    <h4>{item.fullName}</h4>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
        {text !== "" && results.length === 0 && <>No results</>}
      </div>
    </>
  );
}
