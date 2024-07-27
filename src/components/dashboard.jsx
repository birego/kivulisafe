import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const categoryColors = {};

const defaultColors = [
  "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FFBD33", 
  "#33FFBD", "#8D33FF", "#FF3380", "#FF8333", "#33FFF6"
];

const getMarkerIcon = (color) => new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="41">
      <path fill="${color}" stroke="black" stroke-width="1" d="M12 2C8.13 2 5 5.13 5 9c0 1.47.51 2.88 1.44 4.05l5.11 6.84c.14.19.36.31.59.31s.45-.12.59-.31l5.11-6.84C18.49 11.88 19 10.47 19 9c0-3.87-3.13-7-7-7zm0 11.5c-2.48 0-4.5-2.02-4.5-4.5S9.52 4.5 12 4.5 16.5 6.52 16.5 9 14.48 13.5 12 13.5z"/>
    </svg>`
  )}`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const getColorForCategory = (category) => {
  if (!categoryColors[category]) {
    const existingColors = Object.values(categoryColors);
    const availableColors = defaultColors.filter(color => !existingColors.includes(color));
    categoryColors[category] = availableColors.length > 0 ? availableColors[0] : defaultColors[existingColors.length % defaultColors.length];
  }
  return categoryColors[category];
};

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const chartRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("https://kivulisafebackend-production.up.railway.app/reports");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports", error);
      }
    };
    fetchReports();
  }, []);

  const categories = reports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Nombre de signalements",
        data: Object.values(categories),
        backgroundColor: Object.keys(categories).map(category => getColorForCategory(category)),
        borderColor: Object.keys(categories).map(category => getColorForCategory(category)),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const exportTableToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reports);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");
    XLSX.writeFile(wb, "reports.xlsx");
  };

  const exportChartToPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 100);
    pdf.save("chart.pdf");
  };

  const exportMapToImage = async () => {
    const canvas = await html2canvas(mapRef.current);
    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "map.png";
    link.click();
  };

  return (
   <div className="w-screen bg-gray-100 dark:bg-gray-900">
     <div className="container mx-auto p-4 w-screen h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Tableau de Bord des Signalements</h1>
      <div className="mb-6">
        <div className="relative h-64" ref={chartRef}>
          <Bar data={data} options={options} />
        </div>
      </div>
      <div className="mb-8 " ref={mapRef}>
        <MapContainer center={[-1.680, 29.220]} zoom={13} className="h-96 rounded-md">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {reports.map(report => (
            <Marker 
              key={report.id} 
              position={[report.latitude, report.longitude]} 
              icon={getMarkerIcon(getColorForCategory(report.category))}
            >
              <Popup>
                <strong>Catégorie:</strong> {report.category} <br />
                <strong>Description:</strong> {report.description} <br />
                <strong>Date:</strong> {report.incidentDate}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Liste des Signalements</h3>
        <button onClick={exportTableToExcel} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">Exporter en Excel</button>
        <button onClick={exportChartToPDF} className="mb-4 ml-2 px-4 py-2 bg-green-500 text-white rounded">Exporter le Graphique en PDF</button>
        {/* <button onClick={exportMapToImage} className="mb-4 ml-2 px-4 py-2 bg-red-500 text-white rounded">Exporter la Carte en Image</button> */}
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date de l'incident</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Latitude</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Longitude</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {reports.map(report => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{report.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.incidentDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.latitude}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.longitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
   </div>
  );
};

export default Dashboard;
