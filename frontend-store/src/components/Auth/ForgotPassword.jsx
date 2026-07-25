import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [step] = useState(1);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-10">

        <Link to="/login" className="text-blue-600 text-sm mb-6 inline-block">
          ← Back to login
        </Link>

        <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
          Reset Password
        </h2>

        {/* Step 1 */}
        {step === 1 && (
          <form className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              className="w-full h-8 rounded-md border border-gray-300 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full h-8 bg-blue-600 text-white rounded-md">
              Send OTP
            </button>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form className="space-y-6">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full h-10 rounded-md border border-gray-300 px-4 text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full h-10 bg-blue-600 text-white rounded-md">
              Verify OTP
            </button>
          </form>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form className="space-y-6">
            <input
              type="password"
              placeholder="New password"
              className="w-full h-10 rounded-md border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full h-10 rounded-md border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full h-10 bg-blue-600 text-white rounded-md">
              Reset Password
            </button>
          </form>
        )}

      </div>
    </div>
  );
}