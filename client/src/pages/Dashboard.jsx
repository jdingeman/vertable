import "../css/Dashboard.css";
import Navbar from "../components/Navbar";
import Table from "../components/Table/Table";

function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="dashboard">
        <Table />
      </div>
    </>
  );
}

export default Dashboard;
