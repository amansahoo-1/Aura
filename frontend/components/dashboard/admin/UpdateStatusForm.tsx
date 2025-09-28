"use client";

import React, { useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";
import { UserStatus, KycStatus } from "@/types";

//  Define a strong type for the component's props
interface UpdateStatusFormProps {
  entityId: string;
  currentStatus: UserStatus | KycStatus;
  apiPath: string;
  // Type the enum as a Record (object with string keys and specific values)
  statusEnum: Record<string, UserStatus | KycStatus>;
  title: string;
  fieldName: string;
}

export const UpdateStatusForm = ({
  currentStatus,
  apiPath,
  statusEnum,
  title,
  fieldName,
}: UpdateStatusFormProps) => {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.patch(apiPath, { [fieldName]: status });
      alert("Status updated successfully!");
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="flex items-center space-x-4">
        <select
          title={title}
          value={status}
          onChange={(e) => setStatus(e.target.value as UserStatus | KycStatus)}
          className="p-2 border rounded-md"
        >
          {/* ✅ 3. TypeScript now knows `s` is a string, which is a valid key/value */}
          {Object.values(statusEnum).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};
