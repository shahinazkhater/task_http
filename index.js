
import http from "node:http";

const users = [
  { name: "eyad", age: 20 },
  { name: "shahyinaz", age: 20 },
];

// تعريف الموديول

const server = http.createServer((req, res) => {

  const { method, url } = req;

  // METHOD = post / get
  // url = users

  if (method === "POST" && url === "/users") {
    // دا الوضع الصح

    let body = "";
    // الكلاينت هيبعت بيانات user

    req.on("data", (chunk) => {
      // كل مجزء من ال requst body حطه فالمتغير body

      // جزء من البيانات.

      // يعني ممكن البيانات توصل كذا جزء:

      // chunk 1
      // chunk 2
      // chunk 3

      // وإحنا بنجمعهم:

      // body += chunk;

      // لحد ما يبقى عندنا الـ Body كامل.

      body += chunk;
    });

    req.on("end", () => {
      // خلاص، كل الـ body وصل.

      // ساعتها نقدر نتعامل مع البيانات.

      const data = JSON.parse(body);

      users.push(data);
      // لو فيه عنصر جديد جه ضيفه فالاخر

      res.writeHead(201, {
        "content-type": "application/json",
        // هنا السيرفر بيجهز الـ Response.

        // 201 معناها:

        // Created — الحاجة الجديدة اتعملت بنجاح.
      });

      res.end(
        JSON.stringify({
          // JSON.stringify() بتحول الـ JavaScript Object إلى JSON.

          // هنا بنبعت الـ user الجديد للـ client.

          message: "user created successfully",
          user: data,
        })
      );
    });
  }

  // =========================
  // GET ALL USERS
  // =========================

  else if (method === "GET" && url === "/users") {

    res.writeHead(200, {
      "content-type": "application/json",
    });

    // هنا بنبعت كل الـ users للـ client.
    res.end(JSON.stringify(users));
  }

  // =========================
  // GET SINGLE USER
  // =========================

  else if (method === "GET" && url.startsWith("/users/")) {

    const userName = url.split("/users/")[1];

    const user = users.find((u) => u.name === userName);

    if (user) {

      res.writeHead(200, {
        "content-type": "application/json",
      });

      res.end(JSON.stringify(user));

    } else {

      res.writeHead(404, {
        "content-type": "application/json",
      });

      res.end(
        JSON.stringify({
          error: `User ${userName} not found`,
        })
      );
    }
  }

  // =========================
  // UPDATE USER
  // PATCH /users/eyad
  // PUT /users/eyad
  // =========================

  else if (
    (method === "PATCH" || method === "PUT") &&
    url.startsWith("/users/")
  ) {

    const userName = url.split("/users/")[1];

    const user = users.find((u) => u.name === userName);

    if (!user) {

      res.writeHead(404, {
        "content-type": "application/json",
      });

      return res.end(
        JSON.stringify({
          error: `User ${userName} not found`,
        })
      );
    }

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {

      const data = JSON.parse(body);

      // update user
      Object.assign(user, data);

      res.writeHead(200, {
        "content-type": "application/json",
      });

      res.end(
        JSON.stringify({
          message: "User updated successfully",
          user: user,
        })
      );
    });
  }

  // =========================
  // DELETE USER
  // DELETE /users/eyad
  // =========================

  else if (
    method === "DELETE" &&
    url.startsWith("/users/")
  ) {

    const userName = url.split("/users/")[1];

    const userIndex = users.findIndex(
      (u) => u.name === userName
    );

    if (userIndex === -1) {

      res.writeHead(404, {
        "content-type": "application/json",
      });

      res.end(
        JSON.stringify({
          error: `User ${userName} not found`,
        })
      );

    } else {

      const deletedUser = users.splice(userIndex, 1);

      res.writeHead(200, {
        "content-type": "application/json",
      });

      res.end(
        JSON.stringify({
          message: "User deleted successfully",
          user: deletedUser[0],
        })
      );
    }
  }

  // =========================
  // ROUTE NOT FOUND
  // =========================

  else {

    res.writeHead(404, {
      "content-type": "application/json",
    });

    res.end(
      JSON.stringify({
        error: "Route not found",
      })
    );
  }

}); // قفل createServer

// =========================
// START SERVER
// =========================

server.listen(3000, () => {
  console.log("Server started on port 3000");
});

