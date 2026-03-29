const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const fs = require("fs");
const path = require("path");

const firebaseConfig = {
  apiKey: "AIzaSyAR9an0pC5SKFHpfJ_NfAxbY9WncTZGqqA",
  authDomain: "labouffe-1404.firebaseapp.com",
  projectId: "labouffe-1404",
  storageBucket: "labouffe-1404.firebasestorage.app",
  messagingSenderId: "1037371659704",
  appId: "1:1037371659704:web:3c64e76cd7fbb0da406b4d",
  measurementId: "G-D958BMNWWY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const CATEGORIES = [
  { id: "cat_1", name: "Dishes", img: "dishes.png" },
  { id: "cat_2", name: "Pizza", img: "pizza.png" },
  { id: "cat_3", name: "Burger", img: "burger.png" },
  { id: "cat_4", name: "Drinks", img: "drinks.png" },
  { id: "cat_5", name: "Dessert", img: "dessert.png" },
];

const RESTAURANTS = [
  { id: "res_home_1", name: "Pizza Hut", desc: "Best pizza in town", rating: "4.5", time: "15 mins.", price: "", km: "2KM", img: "banner_bg.png" },
  { id: "res_home_2", name: "KFC", desc: "Fried chicken", rating: "4.8", time: "20 mins.", price: "", km: "3KM", img: "banner_bg2.png" },
  { id: "res_1", name: "Al Halbi Restaurant", desc: "Grills, Kebab, Sandwiches", rating: "4.5 (100+)", time: "20 mins", price: "AED 2.50", img: "res_alhalbi.png" },
  { id: "res_2", name: "Chikiki Restaurant", desc: "Burgers, Wraps, Sandwiches", rating: "4.5 (100+)", time: "15 mins", price: "AED 1.50", img: "res_chikiki.png" },
  { id: "res_3", name: "La Rosana Restaurant", desc: "Pasta, Desserts, Drinks", rating: "4.6 (100+)", time: "25 mins", price: "AED 3.50", img: "res_larosana.png" },
  { id: "res_4", name: "Al Shary Restaurant", desc: "Grills, Kebab, Egyptian", rating: "4.5 (100+)", time: "20 mins", price: "AED 2.50", img: "res_alshary.png" },
  { id: "res_5", name: "Sizzler Restaurant", desc: "Pizza, Burger, Sandwiches", rating: "4.7 (100+)", time: "20 mins", price: "AED 3.50", img: "res_sizzler.png" },
];

const FOODS = [
  { id: "food_1", name: "White Rice", desc: "Basmati rice with Vegetable", price: 45, rating: "4.5", categoryId: "cat_1", img: "rice1.png", isPopular: false },
  { id: "food_2", name: "Biryani", desc: "Chicken Biryani India", price: 45, rating: "3.5", categoryId: "cat_1", img: "biryani.png", isPopular: false },
  { id: "food_3", name: "Vegetable Salad", desc: "Vegetable Salad, Thai Cuisine", price: 35.9, rating: "4.5", categoryId: "cat_1", img: "salad.png", isPopular: false },
  { id: "food_4", name: "Jollof Rice", desc: "Nigerian Jollof Rice", price: 45.9, rating: "4.5", categoryId: "cat_1", img: "jollof.png", isPopular: false },
  { id: "food_5", name: "Rice And Plantain", desc: "Fried Rice With Plantain", price: 65.9, rating: "5.5", categoryId: "cat_1", img: "plantain.png", isPopular: false },
  { id: "food_pop_1", name: "Fresh Strawberry", desc: "Fresh fruits", price: 10, rating: "5.0", categoryId: "cat_5", img: "f1.png", isPopular: true },
  { id: "food_pop_2", name: "Mix Beans", desc: "Healthy mix", price: 15, rating: "4.5", categoryId: "cat_1", img: "f2.png", isPopular: true },
  { id: "food_pop_3", name: "Pancakes", desc: "Sweet dessert", price: 20, rating: "4.0", categoryId: "cat_5", img: "f3.png", isPopular: true },
  { id: "food_pop_4", name: "Special Pizza", desc: "Delicious Special", price: 30, rating: "5.0", categoryId: "cat_2", img: "f4.png", isPopular: true },
  { id: "food_pop_5", name: "Juicy Burger", desc: "King size burger", price: 18, rating: "4.5", categoryId: "cat_3", img: "f5.png", isPopular: true },
  { id: "food_pop_6", name: "Hot Soup", desc: "Chicken soup", price: 12, rating: "3.5", categoryId: "cat_1", img: "f6.png", isPopular: true },
];

async function uploadImage(imageFileName, storagePath) {
  const filePath = path.join(__dirname, 'assets', 'images', imageFileName);
  let fileBuffer;
  try {
    fileBuffer = fs.readFileSync(filePath);
  } catch (err) {
    console.log(`Missing file ${filePath}, skipping image.`);
    return "";
  }
  
  const storageReference = ref(storage, storagePath);
  try {
    // In node.js, it's safer to pass Uint8Array instead of raw Buffer
    const uint8Array = new Uint8Array(fileBuffer);
    await uploadBytes(storageReference, uint8Array, { contentType: 'image/png' });
    const url = await getDownloadURL(storageReference);
    return url;
  } catch(e) {
    console.error("Error uploading", storagePath, e);
    return "";
  }
}

async function seed() {
  try {
    console.log("Seeding categories...");
    for (let cat of CATEGORIES) {
      const url = await uploadImage(cat.img, `categories/${cat.img}`);
      await setDoc(doc(db, "categories", cat.id), {
        id: cat.id,
        name: cat.name,
        iconUrl: url
      });
      console.log(`Saved ${cat.name}`);
    }

    console.log("Seeding restaurants...");
    for (let res of RESTAURANTS) {
      const url = await uploadImage(res.img, `restaurants/${res.img}`);
      await setDoc(doc(db, "restaurants", res.id), {
        id: res.id,
        name: res.name,
        desc: res.desc,
        rating: res.rating,
        time: res.time,
        price: res.price || "",
        km: res.km || "",
        imageUrl: url
      });
      console.log(`Saved ${res.name}`);
    }

    console.log("Seeding foods...");
    for (let food of FOODS) {
      const url = await uploadImage(food.img, `foods/${food.img}`);
      await setDoc(doc(db, "foods", food.id), {
        id: food.id,
        name: food.name,
        desc: food.desc,
        price: food.price,
        rating: food.rating,
        categoryId: food.categoryId,
        isPopular: food.isPopular,
        imageUrl: url
      });
      console.log(`Saved ${food.name}`);
    }
    
    console.log("All done! Seed Data is successfully initialized in Firebase.");
    process.exit(0);
  } catch (err) {
    console.error("Fatal error during seeding:", err);
    process.exit(1);
  }
}

seed();
