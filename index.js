const fs = require("fs");
const axios = require("axios");
const { convertArrayToCSV } = require("convert-array-to-csv");

const main = async (id, count) => {
  const results = [];

  for (let i = 0; i < count; i++) {
    try {
      const res = await axios.get(`https://www.yardbook.com/businesses/${id}`);

      const str1 = res.data.split('meta name="description"')[1];
      const str2 = str1.split('<meta name="author"')[0];

      const regex = str2
        .trim()
        .replace(/^content="(.*)|^.*/gm, "$1")
        .trim();

      const data = {
        data: regex,
      };

      results.push(data);

      const csv = await convertArrayToCSV(results);

      fs.writeFile("./output.csv", csv, () => {});

      console.log(`${i}: Successfully scraped ${id}`);
    } catch (e) {
      console.log(`${i}: Failed to scrape ${id}`);
    }

    id++;
  }
};

main("112510", 1000);
