#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async')
const Item = require('./models/item')
const Category = require("./models/category")

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); 

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const categories = []
const items = []


function categoryCreate(name, description, cb) {
    categoryDetail = {
        name: name,
        description: description
    }

    const category = new Category(categoryDetail);

    category.save(function (err) {
        if(err) {
            cb(err, null);
            return;
        }
        console.log("New category: ", category);
        categories.push(category);
        cb(null, category);
    });

}

function itemCreate(name, description, category, price, inStock, cb) {
    itemDetail = {
        name: name,
        description: description,
        category: category,
        price: price,
    }
    if (inStock != false) {
        itemDetail.inStock = inStock;
    }
    const item = new Item(itemDetail);
    item.save(function (err) {
        if(err) {
            cb(err, null);
            return;
        }
        console.log("New item: ", item);
        items.push(item);
        cb(null, item);
    });
}

function createCategories(cb) {
    async.parallel([
        function(callback) {
          categoryCreate("Vinyl Discs", 
          `Vinyl discs, also known as vinyl records or simply "records," are an analog audio format that has been popular for over a century. These discs are made of a durable, plastic-like material known as polyvinyl chloride (PVC) and feature a groove that spirals from the outside edge to the center.

          Vinyl discs are known for their warm and rich sound quality, which many music lovers prefer over the digital formats that have become ubiquitous in recent years. They offer a unique listening experience, with subtle nuances and imperfections that add character to the music.
          
          In addition to their audio quality, vinyl discs are also highly collectible, with many music enthusiasts and collectors building extensive collections. Vinyl discs often feature beautiful artwork and packaging, which can add to their appeal as a physical product.
          
          Overall, vinyl discs are a timeless and enduring format that offer a one-of-a-kind listening experience and a unique way to connect with the music you love.`, 
          callback);
        },
        function(callback) {
          categoryCreate("Digital Albums",
          `Digital albums offer a convenient and accessible way to enjoy music. They also offer a wide range of features and benefits that are unique to the digital format, such as the ability to easily skip between tracks, create playlists, and access a virtually limitless library of music.

          In addition to their convenience, digital albums also offer high-quality sound that can rival or even surpass the sound quality of vinyl discs, depending on the quality of the digital files and the equipment used to play them. Many digital albums are also available in high-resolution formats, which offer even greater fidelity and detail.
          
          Overall, digital albums are a versatile and accessible way to enjoy music in the modern era, offering high-quality sound, convenient access, and a wide range of features and benefits that are unique to the digital format.`,
          callback);
        },
        function(callback) {
          categoryCreate("Clothing",
          `Clothing is a fundamental aspect of human life that serves both practical and aesthetic purposes. Clothing can be defined as any material or fabric that is worn on the body, including garments such as shirts, pants, dresses, and jackets, as well as accessories such as hats, scarves, and jewelry.

          In addition to providing protection and comfort from the elements, clothing is also a form of self-expression and personal style. Clothing can convey a wide range of messages about an individual, including their social status, cultural background, and personal taste.
          
          Clothing is available in a vast array of styles, fabrics, and designs, ranging from casual and practical to formal and elegant. Different types of clothing are often associated with specific occasions, such as formal events, athletic activities, or casual outings.`,
          callback);
        },
    ], cb);
}

function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate("Blonde - Frank Ocean - Vinyl", 
          `Blonde is the critically acclaimed second studio album by American singer-songwriter Frank Ocean. Released in 2016, Blonde features a unique blend of R&B, pop, and indie rock influences, combined with Ocean's soulful vocals and introspective lyrics.

          The album is characterized by its dreamy, atmospheric soundscapes, which are often understated and minimalistic, allowing Ocean's emotive voice to take center stage. Lyrically, Blonde explores themes of love, loss, and self-discovery, with many songs reflecting on Ocean's personal experiences and relationships.
          
          Blonde features a number of notable collaborations with other artists, including Beyoncé, André 3000, and James Blake, among others. The album has been praised for its innovative and experimental production, which incorporates a diverse range of musical elements, such as guitar loops, ambient soundscapes, and pitched-up vocal samples.
          
          Blonde has been widely acclaimed by critics and fans alike, with many praising its bold and original approach to contemporary R&B. The album has been cited as a significant influence on the direction of modern pop and R&B music, and it has been recognized as one of the most important albums of the 2010s.
          
          Overall, Blonde is a masterful work of contemporary music that showcases Frank Ocean's unique talent and vision. With its innovative production, soulful vocals, and introspective lyrics, the album has cemented Ocean's place as one of the most important and influential artists of his generation.`,
          categories[0],
          99.90,
          6,
          callback);
        },
        function(callback) {
          itemCreate("IGOR - Tyler, The Creator - Digital",
          `IGOR is the highly acclaimed fifth studio album by American rapper and producer Tyler, The Creator. Released in 2019, the album features a unique blend of hip-hop, R&B, and pop influences, combined with Tyler's signature experimental production and emotive lyricism.

          IGOR is a concept album that tells the story of a romantic relationship, with Tyler taking on the persona of the titular character, a lovelorn protagonist who is grappling with the complexities of love and heartbreak. The album is characterized by its dreamy, synth-heavy soundscapes, which are often unconventional and off-kilter, blending elements of vintage funk, soul, and electronic music.
          
          Lyrically, IGOR explores themes of love, loss, and identity, with Tyler's lyrics delving into his personal experiences and emotions in a raw and unguarded way. The album features collaborations with a number of high-profile artists, including Solange, Kanye West, and Pharrell Williams, among others.
          
          IGOR has been widely praised for its innovative and boundary-pushing approach to contemporary hip-hop and R&B, with many critics hailing it as a career-defining work for Tyler, The Creator. The album has been recognized as one of the most significant and influential albums of the 2010s, and it has garnered numerous accolades and awards, including a Grammy for Best Rap Album.
          
          Overall, IGOR is a groundbreaking and deeply personal work of contemporary music that showcases Tyler, The Creator's unique talent and vision. With its unconventional production, emotive lyricism, and genre-bending sound, the album represents a bold and transformative statement from one of the most exciting and visionary artists of his generation.`,
          categories[1],
          9.90,
          null,
          callback);
        },
        function(callback) {
            itemCreate("Logo Beanie - Golf Wang",
            `A beenie from Golf Wang is a stylish and practical accessory that is perfect for keeping your head warm and comfortable during cold weather. Made from high-quality materials such as acrylic or wool, Golf Wang beanies are designed to be both durable and comfortable, with a soft and cozy texture that feels great against your skin.

            Golf Wang is a popular streetwear brand founded by American rapper and producer Tyler, The Creator. The brand is known for its bold and playful designs, which often incorporate vibrant colors, bold graphics, and irreverent imagery.`,
            categories[2],
            35,
            36,
            callback);
          },
        ],
        cb);
}


async.series([
    createCategories,
    createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    mongoose.connection.close();
});
