import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { Asset } from 'expo-asset';
import { db, storage } from '../config/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CATEGORIES = [
  { id: "cat_1", name: "Dishes", img: require("../assets/images/dishes.png") },
  { id: "cat_2", name: "Pizza", img: require("../assets/images/pizza.png") },
  { id: "cat_3", name: "Burger", img: require("../assets/images/burger.png") },
  { id: "cat_4", name: "Drinks", img: require("../assets/images/drinks.png") },
  { id: "cat_5", name: "Dessert", img: require("../assets/images/dessert.png") },
];

const RESTAURANTS = [
  { id: "res_home_1", name: "Pizza Hut", desc: "Best pizza in town", rating: "4.5", time: "15 mins.", price: "", km: "2KM", img: require("../assets/images/banner_bg.png") },
  { id: "res_home_2", name: "KFC", desc: "Fried chicken", rating: "4.8", time: "20 mins.", price: "", km: "3KM", img: require("../assets/images/banner_bg2.png") },
  { id: "res_1", name: "Al Halbi Restaurant", desc: "Grills, Kebab, Sandwiches", rating: "4.5 (100+)", time: "20 mins", price: "AED 2.50", img: require("../assets/images/res_alhalbi.png") },
  { id: "res_2", name: "Chikiki Restaurant", desc: "Burgers, Wraps, Sandwiches", rating: "4.5 (100+)", time: "15 mins", price: "AED 1.50", img: require("../assets/images/res_chikiki.png") },
  { id: "res_3", name: "La Rosana Restaurant", desc: "Pasta, Desserts, Drinks", rating: "4.6 (100+)", time: "25 mins", price: "AED 3.50", img: require("../assets/images/res_larosana.png") },
  { id: "res_4", name: "Al Shary Restaurant", desc: "Grills, Kebab, Egyptian", rating: "4.5 (100+)", time: "20 mins", price: "AED 2.50", img: require("../assets/images/res_alshary.png") },
  { id: "res_5", name: "Sizzler Restaurant", desc: "Pizza, Burger, Sandwiches", rating: "4.7 (100+)", time: "20 mins", price: "AED 3.50", img: require("../assets/images/res_sizzler.png") },
];

const FOODS = [
  { id: "food_1", name: "White Rice", desc: "Basmati rice with Vegetable", price: 45, rating: "4.5", categoryId: "cat_1", img: require("../assets/images/rice1.png"), isPopular: false },
  { id: "food_2", name: "Biryani", desc: "Chicken Biryani India", price: 45, rating: "3.5", categoryId: "cat_1", img: require("../assets/images/biryani.png"), isPopular: false },
  { id: "food_3", name: "Vegetable Salad", desc: "Vegetable Salad, Thai Cuisine", price: 35.9, rating: "4.5", categoryId: "cat_1", img: require("../assets/images/salad.png"), isPopular: false },
  { id: "food_4", name: "Jollof Rice", desc: "Nigerian Jollof Rice", price: 45.9, rating: "4.5", categoryId: "cat_1", img: require("../assets/images/jollof.png"), isPopular: false },
  { id: "food_5", name: "Rice And Plantain", desc: "Fried Rice With Plantain", price: 65.9, rating: "5.5", categoryId: "cat_1", img: require("../assets/images/plantain.png"), isPopular: false },
  // Popular foods from home screen
  { id: "food_pop_1", name: "Fresh Strawberry", desc: "Fresh fruits", price: 10, rating: "5.0", categoryId: "cat_5", img: require("../assets/images/f1.png"), isPopular: true },
  { id: "food_pop_2", name: "Mix Beans", desc: "Healthy mix", price: 15, rating: "4.5", categoryId: "cat_1", img: require("../assets/images/f2.png"), isPopular: true },
  { id: "food_pop_3", name: "Pancakes", desc: "Sweet dessert", price: 20, rating: "4.0", categoryId: "cat_5", img: require("../assets/images/f3.png"), isPopular: true },
  { id: "food_pop_4", name: "Special Pizza", desc: "Delicious Special", price: 30, rating: "5.0", categoryId: "cat_2", img: require("../assets/images/f4.png"), isPopular: true },
  { id: "food_pop_5", name: "Juicy Burger", desc: "King size burger", price: 18, rating: "4.5", categoryId: "cat_3", img: require("../assets/images/f5.png"), isPopular: true },
  { id: "food_pop_6", name: "Hot Soup", desc: "Chicken soup", price: 12, rating: "3.5", categoryId: "cat_1", img: require("../assets/images/f6.png"), isPopular: true },
];

export default function SeedScreen() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);

  const log = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const uploadImageToStorage = async (imageResource: any, storagePath: string) => {
    try {
      const [{ localUri }] = await Asset.loadAsync(imageResource);
      if (!localUri) throw new Error("Could not load localUri for " + storagePath);
      
      const response = await fetch(localUri);
      const blob = await response.blob();
      
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (e) {
      log(`Error uploading ${storagePath}: ${e}`);
      return null;
    }
  };

  const startSeed = async () => {
    setIsSeeding(true);
    setLogs(["Starting seed process..."]);
    try {
      // 1. Seed Categories
      log("Seeding Categories...");
      for (const item of CATEGORIES) {
        log(`Uploading icon for ${item.name}...`);
        const imgUrl = await uploadImageToStorage(item.img, `categories/${item.id}.png`);
        await setDoc(doc(db, "categories", item.id), {
          id: item.id,
          name: item.name,
          iconUrl: imgUrl || ""
        });
        log(`Saved category ${item.name}`);
      }

      // 2. Seed Restaurants
      log("Seeding Restaurants...");
      for (const item of RESTAURANTS) {
        log(`Uploading image for ${item.name}...`);
        const imgUrl = await uploadImageToStorage(item.img, `restaurants/${item.id}.png`);
        await setDoc(doc(db, "restaurants", item.id), {
          id: item.id,
          name: item.name,
          desc: item.desc,
          rating: item.rating,
          time: item.time,
          price: item.price || "",
          km: item.km || "",
          imageUrl: imgUrl || ""
        });
        log(`Saved restaurant ${item.name}`);
      }

      // 3. Seed Foods
      log("Seeding Foods...");
      for (const item of FOODS) {
        log(`Uploading image for ${item.name}...`);
        const imgUrl = await uploadImageToStorage(item.img, `foods/${item.id}.png`);
        await setDoc(doc(db, "foods", item.id), {
          id: item.id,
          name: item.name,
          desc: item.desc,
          price: item.price,
          rating: item.rating,
          categoryId: item.categoryId,
          isPopular: item.isPopular,
          imageUrl: imgUrl || ""
        });
        log(`Saved food ${item.name}`);
      }

      log("🎉 Data Seeded Successfully!");
    } catch (error) {
       log("Error: " + error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Seeder</Text>
      <Text>Use this screen to push local data & images to Firebase Firestore + Storage.</Text>
      
      <View style={{marginVertical: 20}}>
        <Button title={isSeeding ? "Seeding..." : "START SEEDING"} onPress={startSeed} disabled={isSeeding} color="#FF6332" />
      </View>

      <ScrollView style={styles.logBox}>
        {logs.map((L, i) => (
          <Text key={i} style={styles.logText}>{L}</Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF", marginTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  logBox: { flex: 1, backgroundColor: "#000", padding: 10, borderRadius: 5 },
  logText: { color: "#0F0", fontSize: 12, marginBottom: 5 }
});
