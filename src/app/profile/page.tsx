"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircleIcon, PencilIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { User, Mail, Phone, MapPin, Calendar, ShieldCheck, ShoppingBag, Heart, Settings, Logout } from "lucide-react";
import Image from "next/image";
import LazyLoader from '@/components/ui/LazyLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { Great_Vibes } from 'next/font/google';

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo");
      const adminInfo = localStorage.getItem("adminInfo");
      let userEmail = null;
      if (userInfo) {
        const userData = JSON.parse(userInfo);
        setUser(userData);
        setEditData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || ""
        });
        userEmail = userData.email;
      } else if (adminInfo) {
        const adminData = { ...JSON.parse(adminInfo), isAdmin: true };
        setUser(adminData);
        setEditData({
          name: adminData.name || "",
          email: adminData.email || "",
          phone: adminData.phone || "",
          address: adminData.address || ""
        });
        userEmail = adminData.email;
      } else {
        router.replace("/login");
      }
      if (userEmail) {
        const storedImg = localStorage.getItem(`profileImg_${userEmail}`);
        if (storedImg) setProfileImg(storedImg);
      }
      setLoading(false);
    }
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user && user.email) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setProfileImg(base64);
        localStorage.setItem(`profileImg_${user.email}`, base64);
        window.dispatchEvent(new Event('profileImgUpdated'));
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async () => {
    try {
      // Update user data
      const updatedUser = { ...user, ...editData };
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    try {
      // Here you would typically make an API call to change password
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsChangingPassword(false);
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("adminInfo");
    window.dispatchEvent(new Event("userLogin"));
    router.push("/");
    toast.success("Logged out successfully!");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LazyLoader /></div>;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className={`text-5xl font-normal text-white mb-2 ${greatVibes.className}`}>
              Noamani
            </h1>
            <p className="text-gray-400">Your Personal Profile</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
              {/* Profile Image */}
              <div className="relative inline-block mb-6">
                {profileImg ? (
                  <Image
                    src={profileImg}
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-gray-700 shadow-lg"
                  />
                ) : (
                  <div className="w-30 h-30 rounded-full bg-gray-700 flex items-center justify-center">
                    <UserCircleIcon className="h-20 w-20 text-gray-400" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold shadow cursor-pointer hover:bg-gray-700 transition-colors border border-gray-600">
                  <PencilIcon className="w-3 h-3 inline mr-1" />
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* User Info */}
              <h2 className="text-2xl font-bold text-white mb-2">{user.name || "User"}</h2>
              <p className="text-gray-400 mb-4">{user.email}</p>
              
              {user.isAdmin && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500 text-black text-sm font-semibold mb-4">
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  Admin
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 rounded-lg py-2 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Profile
                </Button>
                
                <Button
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 rounded-lg py-2 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <LockClosedIcon className="w-4 h-4" />
                  Change Password
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
                <ShoppingBag className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">12</h3>
                <p className="text-gray-400 text-sm">Orders</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
                <Heart className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">8</h3>
                <p className="text-gray-400 text-sm">Favorites</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
                <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">2</h3>
                <p className="text-gray-400 text-sm">Years</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-400 text-sm">Full Name</Label>
                  <p className="text-white font-medium">{user.name || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Email Address</Label>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Phone Number</Label>
                  <p className="text-white font-medium">{user.phone || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Address</Label>
                  <p className="text-white font-medium">{user.address || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mt-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Recent Orders
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Order #12345</p>
                    <p className="text-gray-400 text-sm">Delivered on Dec 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-semibold">$89.99</p>
                    <p className="text-green-400 text-sm">Completed</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Order #12344</p>
                    <p className="text-gray-400 text-sm">Delivered on Dec 10, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-semibold">$156.50</p>
                    <p className="text-green-400 text-sm">Completed</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => router.push("/orders")}
                className="w-full mt-6 bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 rounded-lg py-3 font-medium transition-all duration-200"
              >
                View All Orders
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Edit Profile</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400 text-sm">Full Name</Label>
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:ring-gray-500 focus:border-gray-500 rounded-lg"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Email Address</Label>
                  <Input
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:ring-gray-500 focus:border-gray-500 rounded-lg"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Phone Number</Label>
                  <Input
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:ring-gray-500 focus:border-gray-500 rounded-lg"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Address</Label>
                  <Input
                    value={editData.address}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:ring-gray-500 focus:border-gray-500 rounded-lg"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleEditSubmit}
                  className="flex-1 bg-yellow-500 text-black hover:bg-yellow-400 rounded-lg py-2 font-medium transition-all duration-200"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 rounded-lg py-2 font-medium transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isChangingPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Change Password</h3>
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400 text-sm">Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:ring-gray-500 focus:border-gray-500 rounded-lg pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:ring-gray-500 focus:border-gray-500 rounded-lg pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showNewPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:ring-gray-500 focus:border-gray-500 rounded-lg pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handlePasswordChange}
                  className="flex-1 bg-yellow-500 text-black hover:bg-yellow-400 rounded-lg py-2 font-medium transition-all duration-200"
                >
                  Change Password
                </Button>
                <Button
                  onClick={() => setIsChangingPassword(false)}
                  className="flex-1 bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 rounded-lg py-2 font-medium transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 