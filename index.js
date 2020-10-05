const axios = require("axios");
const ObjectsToCsv = require("objects-to-csv");

const main = async (id, count) => {
  const scrapedResults = [];
  for (let i = 0; i < count; i++) {
    try {
      const res = await axios.get(`https://www.yardbook.com/businesses/${id}`);
      const info = await res.data.match(/\w*=".*- Phone:(.*) - Service/g);

      let string1 = info[0].split('content="')[1];
      let string2 = string1.split(" - Service")[0];
      let result = string2.split(" - Phone: ");

      const data = {
        company_name: result[0],
        phone_number: result[1],
      };

      if (data.phone_number) {
        scrapedResults.push(data);
        const csv = new ObjectsToCsv(scrapedResults);
        await csv.toDisk("./data.csv");
        console.log(`Successfully scraped ${id}`);
      } else {
        console.log(`No Phone Number for ${id}`);
      }
    } catch (e) {
      console.log(`No Page Found for ${id}`);
    }

    id++;
  }
};

main("112511", 5);
