import { useEffect, useState } from "react";
const KEY = "iYAD4AwSN2O4khe6da2zFg==kucOU5CO9tG7bn0h";



function App() {


  return (
    <div className="wrapper">
      <nav><h3>QOUTELON</h3></nav>
      <main>
        <section className="hero">
          <h1>Get quotes based on moods or topic.</h1>
          <SearchInput />
        </section>
        <div className="random-intro">
          <RandomQuote />
          <RandomQuote />
        </div>
      </main>
      <footer>
        <p>Made with love by Guardianprime</p>
        <div className="socials">
          <a href="https://x.com/GordianOkon"><i className="fa-brands fa-x-twitter"></i></a>
          <a href="https://github.com/guardianprime"><i className="fa-brands fa-github"></i></a>
          <a href="https://linkedin.com/in/gordian-okon-7b73382b9"><i className="fa-brands fa-linkedin"></i></a>
        </div>
      </footer>
    </div>
  )
}


function SearchInput() {
  const [search, setSearch] = useState("");
  const [quote, setQuote] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generate, setGenerate] = useState(false);
  const [generateText, setGenerateText] = useState(false);

  function handleSearch(e) {
    const value = e.target.value.toLowerCase().trim();
    setSearch(value);
  }

  function handleGeneration() {
    setGenerate(true);
  }

  function handleSearchAgain() {
    setGenerateText(true);
  }

  useEffect(() => {
    if (!search && !generateText) return;
    const controller = new AbortController();
    async function fetchQuote() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${search}`, {
          headers: { 'X-Api-Key': KEY },
          signal: controller.signal
        });

        if (!res.ok) throw new Error("Something went wrong with fetching a quote");

        const data = await res.json();

        if (data.Response === "False" || data.length === 0) throw new Error("Quote not found. Try words like 'happiness', 'success', 'money'");
        setQuote(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuote();
    if (generateText) {
      fetchQuote();
      setGenerateText(false);
    }
    return () => {
      controller.abort();
    };
  }, [search, generateText]);

  useEffect(() => {
    async function generateRandom() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`https://api.api-ninjas.com/v1/quotes`, { headers: { 'X-Api-Key': KEY } });
        if (!res.ok) throw new Error("Failed to fetch random quote");
        const data = await res.json();

        setQuote(data);
      } catch (err) {
        setError("Failed to fetch random quote");
      } finally {
        setIsLoading(false);
        setGenerate(false);
      }
    }
    if (generate) {
      generateRandom();
    }
  }, [generate]);

  return (
    <div className="fetch-container">
      <div className="search-container">
        <div className="wrapper-search">
          <div className="box">
            <input type="text" value={search} onChange={handleSearch} placeholder="search...." />
            <span>
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>
        </div>
        <button onClick={search.length > 2 ? handleSearchAgain : handleGeneration}>
          Generate {search.length > 2 ? "more" : "random"}
        </button>
      </div>
      {(search || generateText || !generate) && (
        <div className="fetch-quote">
          {isLoading ? "Loading........" :
            (error ? <p>{error}</p> :
              <ul className="result">
                {quote.map((item, index) => <ResultQuotes key={index} item={item} />)}
              </ul>)}
        </div>
      )}
    </div>
  );
}

function ResultQuotes({ item }) {
  return (
    <li>
      <p className="quote">
        <span><i className="fa-solid fa-quote-left"></i></span>
        {item.quote}
        <span><i className="fa-solid fa-quote-right"></i></span>
      </p>
      <p className="category">- {item.category}</p>
      <h5 className="author">{item.author}</h5>
    </li>
  )
}

function RandomQuote() {
  const [randomQuote, setRandomQuote] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function NewFetch() {
      try {
        const res = await fetch(`https://api.api-ninjas.com/v1/quotes`, { headers: { 'X-Api-Key': KEY } });
        if (!res.ok) {
          throw new Error("Failed to fetch quotes");
        }
        const data = await res.json();
        setRandomQuote(data);
      } catch (err) {
        setError(err.message);
      }
    }

    NewFetch(); // Initial fetch
    const intervalId = setInterval(NewFetch, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="quote-container">
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <ul>
          {randomQuote.map((item, index) => (
            <li key={index}>
              <p className="quote">
                <span><i className="fa-solid fa-quote-left"></i></span>
                {item.quote}
                <span><i className="fa-solid fa-quote-right"></i></span>
              </p>
              <p className="category">- {item.category}</p>
              <h5 className="author">{item.author}</h5>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


export default App;