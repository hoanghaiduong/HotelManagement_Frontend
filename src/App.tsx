import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import PrivateRoute from "./components/common/PrivateRoute";
import UserManager from "./pages/Users/UserManager";
import RoomTypesManager from "./pages/Dashboard/RoomTypes/RoomTypesManager";
import SingleRoomType from "./pages/Dashboard/RoomTypes/SingleRoomType";
import RoomTypeAdd from "./pages/Dashboard/RoomTypes/RoomTypeAdd";
import RoomTypeEdit from "./pages/Dashboard/RoomTypes/RoomTypeEdit";
import RoomManager from "./pages/Dashboard/Rooms/RoomManager";
import AmenitiesManager from "./pages/Dashboard/Amenities/AmenitiesManager";
import ServiceTypeManager from "./pages/Dashboard/ServiceTypes/ServiceTypeManager";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route
            element={
              <PrivateRoute requireAdmin={true}>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index path="/" element={<Home />} />
            <Route path="/users" element={<UserManager />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/profile/:id" element={<UserProfiles />} />
            <Route path="/roomTypes" element={<RoomTypesManager />} />
            <Route path="/roomType/add" element={<RoomTypeAdd />} />
            <Route path="/roomType/edit/:id" element={<RoomTypeEdit />} />
            <Route path="/roomType/:id" element={<SingleRoomType />} />
            <Route path="/rooms" element={<RoomManager />} />
            <Route path="/amenities" element={<AmenitiesManager />} />
            <Route path="/serviceTypes" element={<ServiceTypeManager />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
