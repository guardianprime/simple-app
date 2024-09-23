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
    setSearch(e.target.value);
  }

  function handleGeneration() {
    if (search) return;
    setGenerate(true);
    console.log("generating.....");
  }

  function handleSearchAgain() {
    setGenerateText(true);
    console.log("searching again");
  }

  useEffect(() => {
    if (!search) return;
    const controller = new AbortController();
    async function Search() {
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

        console.log(data);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    Search();
    if (generateText) {
      Search();
      setGenerateText(false);
    }
    return () => {
      controller.abort();
      setQuote([]);
    };
  }, [search, generateText]);

  useEffect(() => {
    async function generateRandom() {
      const res = await fetch(`https://api.api-ninjas.com/v1/quotes`, { headers: { 'X-Api-Key': KEY } });
      const data = await res.json();
      setQuote(data);
      setGenerate(false);
    }
    if (generate) {
      generateRandom();
    }
  }, [generate]);

  return (
    <div className="fetch-container">
      <div className="search-container">
        <input type="text" value={search} onChange={handleSearch} />
        <button onClick={search.length > 2 && !error ? handleSearchAgain : handleGeneration}>
          Generate {search.length > 2 && !error ? "more" : "random"}
        </button>
      </div>
      <div className="fetch-quote">
        {isLoading ? "Loading........" :
          (error ? <p>{error}</p> :
            <ul className="result">
              {quote.map((item, index) => <ResultQuotes key={index} item={item} />)}
            </ul>)}
      </div>
    </div>
  );
}




function ResultQuotes({ item }) {
  return (
    <li>
      <p>{item.quote}</p>
      <p><span>Category: {item.category}</span><span>Author: {item.author}</span></p>
    </li>
  )
}

function RandomQuote() {
  const [randomQuote, setRandomQuote] = useState([]);

  useEffect(() => {
    async function NewFetch() {
      const res = await fetch(`https://api.api-ninjas.com/v1/quotes`, { headers: { 'X-Api-Key': KEY } });
      const data = await res.json();
      setRandomQuote(data);
    }

    const intervalId = setInterval(NewFetch, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <ul>
        {randomQuote.map((item, index) => (
          <li key={index}>
            <p>{item.quote}</p>
            <p>{item.category}</p>
            <h5>{item.author}</h5>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default App;