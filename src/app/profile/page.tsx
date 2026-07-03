"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircleIcon, PencilIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { User, ShieldCheck, ShoppingBag, IndianRupee, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import LazyLoader from '@/components/ui/LazyLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  processing: "bg-blue-50 text-blue-700 border border-blue-200",
};
const STATUS_DEFAULT = "bg-amber-50 text-amber-700 border border-amber-200";

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

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

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

  useEffect(() => {
    if (!user?.email) return;
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch(`/api/orders?userEmail=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

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
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsChangingPassword(false);
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LazyLoader /></div>;
  if (!user) return null;

  const sortedOrders = orders
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const recentOrders = sortedOrders.slice(0, 3);
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const lastOrderDate = sortedOrders[0]?.createdAt
    ? new Date(sortedOrders[0].createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative h-[30vh] bg-black text-white flex items-center justify-center">
        <div className="text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 6 }}
            className="text-4xl sm:text-5xl font-light mb-2"
            style={{ fontFamily: 'Didot, serif' }}
          >
            My Account
          </motion.h1>
          <p className="text-white/60">Manage your profile and orders</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
              {/* Profile Image */}
              <div className="relative inline-block mb-5">
                {profileImg ? (
                  <Image
                    src={profileImg}
                    alt="Profile"
                    width={110}
                    height={110}
                    className="rounded-full object-cover border-4 border-gray-100 shadow-sm"
                  />
                ) : (
                  <div className="w-[110px] h-[110px] rounded-full bg-gray-100 flex items-center justify-center">
                    <UserCircleIcon className="h-16 w-16 text-gray-300" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-black text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow cursor-pointer hover:bg-gray-800 transition-colors">
                  <PencilIcon className="w-3 h-3 inline mr-1" />
                  Edit
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-1">{user.name || "User"}</h2>
              <p className="text-gray-500 text-sm mb-4">{user.email}</p>

              {user.isAdmin && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#bfa14a]/10 text-[#8a6f2f] text-xs font-semibold mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Admin
                </div>
              )}

              <div className="space-y-2.5 mt-2">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-white border border-gray-300 text-gray-800 hover:border-gray-900 rounded-lg py-2 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Profile
                </Button>

                <Button
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full bg-white border border-gray-300 text-gray-800 hover:border-gray-900 rounded-lg py-2 font-medium transition-all duration-200 flex items-center justify-center gap-2"
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
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            {/* Quick Stats — real data, computed from actual orders */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 sm:p-6 text-center">
                <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-[#bfa14a] mx-auto mb-2.5" />
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
                  {ordersLoading ? '—' : orders.length}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm">Orders</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 sm:p-6 text-center">
                <IndianRupee className="w-6 h-6 sm:w-7 sm:h-7 text-[#bfa14a] mx-auto mb-2.5" />
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
                  {ordersLoading ? '—' : `₹${totalSpent.toLocaleString('en-IN')}`}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm">Total Spent</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 sm:p-6 text-center">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-[#bfa14a] mx-auto mb-2.5" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                  {ordersLoading ? '—' : lastOrderDate}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm">Last Order</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                Profile Information
              </h3>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-400 text-xs uppercase tracking-wide">Full Name</Label>
                  <p className="text-gray-900 font-medium mt-1">{user.name || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-xs uppercase tracking-wide">Email Address</Label>
                  <p className="text-gray-900 font-medium mt-1">{user.email}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-xs uppercase tracking-wide">Phone Number</Label>
                  <p className="text-gray-900 font-medium mt-1">{user.phone || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-xs uppercase tracking-wide">Address</Label>
                  <p className="text-gray-900 font-medium mt-1">{user.address || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders — real data */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gray-400" />
                Recent Orders
              </h3>

              {ordersLoading ? (
                <div className="flex justify-center py-8">
                  <LazyLoader />
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-6">You haven&apos;t placed any orders yet.</p>
                  <Link
                    href="/shop"
                    className="inline-block bg-black text-white px-6 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-gray-900 font-medium text-sm">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 font-semibold text-sm">₹{order.totalAmount}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[order.status] || STATUS_DEFAULT}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {recentOrders.length > 0 && (
                <Link
                  href="/orders"
                  className="w-full mt-6 bg-white border border-gray-300 text-gray-800 hover:border-gray-900 rounded-lg py-3 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  View All Orders
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
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
              className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-500 text-sm">Full Name</Label>
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] rounded-lg"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label className="text-gray-500 text-sm">Email Address</Label>
                  <Input
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] rounded-lg"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label className="text-gray-500 text-sm">Phone Number</Label>
                  <Input
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] rounded-lg"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label className="text-gray-500 text-sm">Address</Label>
                  <Input
                    value={editData.address}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] rounded-lg"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleEditSubmit}
                  className="flex-1 bg-gradient-to-r from-[#bfa14a] to-[#9c7e33] hover:from-[#cfb25a] hover:to-[#bfa14a] text-black rounded-lg py-2 font-semibold transition-all duration-200"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-white border border-gray-300 text-gray-800 hover:border-gray-900 rounded-lg py-2 font-medium transition-all duration-200"
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
              className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-500 text-sm">Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] rounded-lg pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-500 text-sm">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] rounded-lg pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      {showNewPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-500 text-sm">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] rounded-lg pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handlePasswordChange}
                  className="flex-1 bg-gradient-to-r from-[#bfa14a] to-[#9c7e33] hover:from-[#cfb25a] hover:to-[#bfa14a] text-black rounded-lg py-2 font-semibold transition-all duration-200"
                >
                  Change Password
                </Button>
                <Button
                  onClick={() => setIsChangingPassword(false)}
                  className="flex-1 bg-white border border-gray-300 text-gray-800 hover:border-gray-900 rounded-lg py-2 font-medium transition-all duration-200"
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
