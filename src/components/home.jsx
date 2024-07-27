import { useForm } from "react-hook-form";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import { useState } from "react";
import { CarouselWithContent } from "./carousel";
import { Footer } from "./footer";

const markerIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ setLocation }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={markerIcon}></Marker>
  );
}

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [location, setLocation] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/report", {
        ...data,
        latitude: location?.lat,
        longitude: location?.lng,
      });
      if (response.status === 201) {
        alert("Report successfully submitted");
      } else {
        alert("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting report", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
    <CarouselWithContent/>
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900" id="sign">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white" >
          Formulaire de Signalisation
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center mb-4">
            <input
              id="anonymous"
              type="checkbox"
              {...register("anonymous")}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mr-2"
            />
            <label
              htmlFor="anonymous"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Anonyme
            </label>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Nom (Facultatif)"
                  disabled={isAnonymous}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="w-1/2">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Adresse e-mail (Facultatif si anonyme)"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sélectionnez la date de l'incident
              </label>
              <input
                type="date"
                {...register("incidentDate", { required: "Date requise" })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                  errors.incidentDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.incidentDate && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.incidentDate.message}
                </p>
              )}
            </div>
            <div>
              <textarea
                {...register("description", { required: "Description requise" })}
                placeholder="Décrivez l'incident en détail"
                className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                rows="4"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sélectionnez la catégorie de l'abus
              </label>
              <select
                {...register("category", { required: "Catégorie requise" })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Sélectionnez la catégorie</option>
                <option value="cat1">Catégorie 1</option>
                <option value="cat2">Catégorie 2</option>
                <option value="cat3">Catégorie 3</option>
              </select>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Adresse de l'incident
              </label>
              <MapContainer
                center={[-1.680, 29.220]} // Coordonnées de Goma
                zoom={13}
                className="h-64 mt-2 rounded-md"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker setLocation={setLocation} />
              </MapContainer>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Envoyer le Signalement
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-600 dark:text-gray-400 text-center">
            Je consens à ce que mes informations soient utilisées conformément
            aux termes et conditions de KivuSafe.
          </p>
        </form>
      </div>
    </div>
    <Footer/>
    </>);
}
