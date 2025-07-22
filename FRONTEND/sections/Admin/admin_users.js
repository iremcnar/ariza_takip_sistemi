const userTableBody = document.getElementById("userTableBody");

if (userTableBody) {
  const token = localStorage.getItem("adminToken");
  console.log("Token:", token);

  if (!token) {
    alert("Yetkisiz erişim! Lütfen giriş yapın.");
    window.location.href = "admin-login.html";
  } else {
    fetch("http://localhost:5000/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Kullanıcılar yüklenirken hata oluştu.");
        return res.json();
      })
      .then(data => {
        const users = Array.isArray(data) ? data : data.users || [];
        users.forEach(user => {
          const createdDate = new Date(user.createdAt).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric"
          });

          const row = `
            <tr>
              <td>${user.name || "-"}</td>
              <td>-</td>
              <td>${user.email}</td>
              <td>${createdDate}</td>
              <td>${user.role}</td>
            </tr>
          `;
          userTableBody.innerHTML += row;
        });
      })
      .catch(err => {
        console.error(err);
        alert("Kullanıcılar yüklenemedi: " + err.message);
      });
  }
}
