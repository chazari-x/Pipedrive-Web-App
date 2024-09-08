import {useEffect, useState} from 'react';
import AppExtensionsSDK from "@pipedrive/app-extensions-sdk";
import Main from "./pages/Main.tsx";
import Result from "./pages/Result.tsx";
import {GetDeal} from "./api/api.ts";
import {Button} from "primereact/button";
import {getCookie} from "typescript-cookie";

function App() {
  const [sdk,] = useState(new AppExtensionsSDK())
  const [job, setJob] = useState<string>()
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<string>()
  const [token, setToken] = useState<string>()
  const [updated, setUpdated] = useState(false)

  async function openAuthWindow() {
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const url = '/api/auth';

    window.open(url, 'Pipedrive Auth', `width=${width},height=${height},top=${top},left=${left}`);

    window.addEventListener('message', function (event) {
      if (event.origin === 'https://web.czo.ooo') {
        setToken(event.data)
      }
    });
  }

  function getQueryParameter(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  useEffect(() => {
    sdk.initialize()
      .then(() => setInitialized(true))
      .catch((e) => setError(e.message))

    const id = getQueryParameter('selectedIds');
    if (id) {
      setJob(id);
    } else {
      setError('No job id')
      return
    }

    const token = getCookie('auth');
    if (!token) {
      openAuthWindow()
      return
    }

    setToken(token)
  }, []);

  useEffect(() => {
    if (!token) return
    if (!job) {
      setError('No job id')
      return
    }

    GetDeal(token, job)
      .then(() => {})
      .catch((e) => {
        console.error(e)
        setToken(undefined)
        openAuthWindow()
      })
  }, [token]);

  return !!token
    ? !error
      ? (initialized && job
        ? (!updated ? <Main token={token} setUpdated={setUpdated} job={job} setJob={setJob}/> : <Result job={job} sdk={sdk}/>)
        : <div className="loader">Loading...</div>)
      : <div className="error">{error}</div>
    : <Button label="Authorize" severity="info" rounded onClick={openAuthWindow}/>
}

export default App;
