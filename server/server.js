const express = require('express');
const request = require('request-promise');
const config = require('config');

const app = express();

const PORT = 5174;

const CLIENT_ID = 'b15398166b2b5d5e';
const CLIENT_SECRET = config.CLIENT_SECRET;
const REDIRECT_URI = 'https://web.czo.ooo/api/callback';
const AUTH_URL = `https://oauth.pipedrive.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
const AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

// Поля со значениями по умолчанию
const options = {
  "Job type": {
    "field_type": "enum",
    "name": "Job type",
    "options": [
      "Job type 1",
      "Job type 2",
      "Job type 3",
    ]
  },
  "Job source": {
    "field_type": "enum",
    "name": "Job source",
    "options": [
      "Job source 1",
      "Job source 2",
      "Job source 3",
    ]
  },
  "Job description": {
    "field_type": "varchar",
    "name": "Job description",
  },
  "Address": {
    "field_type": "address",
    "name": "Address",
  },
  "City": {
    "field_type": "varchar",
    "name": "City",
  },
  "State": {
    "field_type": "varchar",
    "name": "State",
  },
  "Zip code": {
    "field_type": "varchar",
    "name": "Zip code",
  },
  "Area": {
    "field_type": "enum",
    "name": "Area",
    "options": [
      "Area 1",
      "Area 2",
      "Area 3",
    ]
  },
  "Job date": {
    "field_type": "date",
    "name": "Job date",
  },
  "Job start time": {
    "field_type": "time",
    "name": "Job start time",
  },
  "Job end time": {
    "field_type": "time",
    "name": "Job end time",
  },
  "Test select": {
    "field_type": "enum",
    "name": "Test select",
    "options": [
      "Test select 1",
      "Test select 2",
      "Test select 3",
    ]
  },
}

app.get('/api', (req, res) => {
  res.send({
    data: []
  });
});

app.get('/api/auth', (req, res) => {
  res.redirect(AUTH_URL);
});

app.get('/api/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Получаем токен
    const tokenResponse = await request({
      method: 'POST',
      uri: 'https://oauth.pipedrive.com/oauth/token',
      headers: {
        Authorization: `Basic ${AUTH}`,
      },
      form: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      },
      json: true
    });
    console.log(tokenResponse.access_token)

    // Получаем все поля сделок
    const response = await fetch("https://api.pipedrive.com/v1/dealFields", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenResponse.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()).data;

    // Поля, которые мы хотим создать
    var fields = [
      "Job type",
      "Job source",
      "Job description",
      "Address",
      "City",
      "State",
      "Zip code",
      "Area",
      "Job date",
      "Job start time",
      "Job end time",
      "Test select",
    ];

    // Удаляем поля, которые уже существуют
    data.forEach((field) => {
      fields = fields.filter((f) => f !== field.name);
    });

    // Создайте новые поля
    fields.map(await (async (field) => {
      await fetch("https://api.pipedrive.com/v1/dealFields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenResponse.access_token}`,
        },
        body: JSON.stringify(options[field]),
      })
    }));

    // Установите куки
    res.cookie('auth', `Bearer ${tokenResponse.access_token}`, {
      expires: new Date(Date.now() + 86400 * 1000),
      path: '/',
    });

    res.send(`
      <div style='display: flex; justify-content: center; align-items: center; height: 100vh'>
        <h1>Success! You can close this window now.</h1>
      </div>
      <script>
        // Отправка токена в родительское окно
        window.opener.postMessage('Bearer ${tokenResponse.access_token}', 'https://web.czo.ooo');
        // Закрываем popup окно
        window.close();
      </script>
    `);
  } catch (error) {
    console.log(error)
    res.send(`
      <div style='display: flex; justify-content: center; align-items: center; height: 100vh'>
        <h1>Something went wrong. Please try again.</h1>
      </div>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});