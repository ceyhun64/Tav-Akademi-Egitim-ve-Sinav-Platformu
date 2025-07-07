import React from "react";

export default function UsersTable({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Ad</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Soyad</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Kullanıcı Adı</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Lokasyon</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Grup</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                <td className="border border-gray-300 px-4 py-2">{user.ad}</td>
                <td className="border border-gray-300 px-4 py-2">{user.soyad}</td>
                <td className="border border-gray-300 px-4 py-2">{user.kullanici_adi}</td>
                <td className="border border-gray-300 px-4 py-2">{user.lokasyon}</td>
                <td className="border border-gray-300 px-4 py-2">{user.grup}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="border border-gray-300 px-4 py-2 text-center"
                colSpan={6}
              >
                Kullanıcı bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
