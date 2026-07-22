import { useState } from "react";
import type { PageType, JobStatusResponse } from "./types";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import UploadPage from "./components/UploadPage";

function App() {
  const BACKEND_URL = "http://127.0.0.1:8000";

  /* ── Global state ── */
  const [currentPage, setCurrentPage] = useState<PageType>("landing");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [goal, setGoal] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatusResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen bg-dp-bg text-dp-text font-sans">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main>
        {currentPage === "landing" && (
          <LandingPage setCurrentPage={setCurrentPage} />
        )}
        {currentPage === "upload" && (
          <UploadPage
            backendUrl={BACKEND_URL}
            apiKey={apiKey}
            setApiKey={setApiKey}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            goal={goal}
            setGoal={setGoal}
            jobId={jobId}
            setJobId={setJobId}
            jobStatus={jobStatus}
            setJobStatus={setJobStatus}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
