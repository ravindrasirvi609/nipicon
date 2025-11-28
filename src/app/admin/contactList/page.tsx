"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingExample from "@/components/Loader";
import { formatShortTime } from "@/lib/utils";

interface Contact {
  name: string;
  email: string;
  mobile: string;
  message: string;
  registrationId: string;
  timeStamp: string;
}

const ContactList = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("/api/contactList");
        setContacts(response.data.contacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-8xl mx-auto bg-white text-black shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Contact List
      </h1>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          className="border border-gray-300 p-3 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center">
          <LoadingExample />
        </div>
      ) : filteredContacts.length > 0 ? (
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Mobile</th>
              <th className="p-3 border-b">Message</th>
              <th className="p-3 border-b">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact) => (
              <tr
                key={contact.registrationId}
                className="hover:bg-gray-100 transition duration-200"
              >
                <td className="p-3 border-b">{contact.name}</td>
                <td className="p-3 border-b">{contact.email}</td>
                <td className="p-3 border-b">
                  <a
                    href={`https://wa.me/91${contact.mobile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {contact.mobile}
                  </a>
                </td>
                <td className="p-3 border-b">{contact.message}</td>
                <td className="p-3 border-b">
                  {formatShortTime(contact.timeStamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-500">No contacts found</div>
      )}
    </div>
  );
};

export default ContactList;
