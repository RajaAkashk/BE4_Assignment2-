const Recipes = require("./models/recipe.models");
const { initializeDatabase } = require("./db/db.connect");

initializeDatabase();

const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

// ***********to check the port***********
// app.get("/", async (req, res) => {
//   res.send("Hello this is recipe database.");
// });

// ***********to add new recipe to database.***********
async function addNewRecipe(recipe) {
  try {
    const newRecipe = new Recipes(recipe);
    const savedRecipe = await newRecipe.save();
    return savedRecipe;
  } catch (error) {
    console.log("Error in add data to database.");
  }
}

app.post("/recipes", async (req, res) => {
  try {
    const newRecipe = await addNewRecipe(req.body);
    if (newRecipe) {
      res
        .status(200)
        .json({ message: "Successfully added new recipe.", Recipe: newRecipe });
    } else {
      res.status(404).json({ error: "Recipes not found." });
    }
  } catch {
    res.status(500).json({ error: "Failed connecting to databse." });
  }
});

//*************to get all the recipes*************
async function allRecipes() {
  try {
    const allData = await Recipes.find();
    return allData;
  } catch (error) {
    console.log("Error in fetchng data from databse.");
  }
}

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await allRecipes();
    if (recipes != 0) {
      res
        .status(200)
        .json({ message: "Successfully getting data.", Recipes: recipes });
    } else {
      res.status(404).json({ error: "Recipes not found." });
    }
  } catch {
    res.status(500).json({ error: "Failed to connect to database." });
  }
});

// *************to get a recipe's details by its title*************
async function recipeByTitle(recipeTitle) {
  try {
    const recipe = await Recipes.findOne({ title: recipeTitle });
    return recipe;
  } catch (error) {
    console.log("Error in fetchng data from databse.");
  }
}

app.get("/recipe/:recipeTitle", async (req, res) => {
  try {
    const recipe = await recipeByTitle(req.params.recipeTitle);
    if (recipe) {
      res
        .status(200)
        .json({ message: "Successfully getting data.", FoundRecipe: recipe });
    } else {
      res.status(404).json({ error: "Error in getting recipe." });
    }
  } catch {
    res.status(500).json({ error: "Failed to connect to database." });
  }
});

// to get details of all the recipes by an author
async function recipeByAuthor(authorName) {
  try {
    const recipe = await Recipes.find({ author: authorName });
    return recipe;
  } catch (error) {
    console.log("Error in fetchng data from databse.");
  }
}

app.get("/recipe/author/:authorName", async (req, res) => {
  try {
    const recipe = await recipeByAuthor(req.params.authorName);
    if (recipe) {
      res.status(200).json({
        message: "Successfully getting data.",
        RecipeBYAuthor: recipe,
      });
    } else {
      res.status(404).json({ error: "Failed to get data." });
    }
  } catch {
    res.status(500).json({ error: "Failed to connect to database." });
  }
});

// to get all the recipes that are of "Easy" difficulty level.
async function recipeByDifficultyLevel(difficultyLevel) {
  try {
    const recipe = await Recipes.find({ difficulty: difficultyLevel });
    return recipe;
  } catch (error) {
    console.log("Error in fetchng data from databse.");
    throw error;
  }
}

app.get("/recipe/difficulty/:difficultyLevel", async (req, res) => {
  try {
    const recipe = await recipeByDifficultyLevel(req.params.difficultyLevel);
    if (recipe) {
      res.status(200).json({
        message: "Successfully getting data.",
        RecipeBYAuthor: recipe,
      });
    } else {
      res.status(404).json({ error: "Failed to get data." });
    }
  } catch {
    res.status(500).json({ error: "Failed to connect to database." });
  }
});

// to update a recipe's difficulty level with the help of its id
async function updateRecipeById(recipeId, updateValue) {
  try {
    const updatdRecipe = await Recipes.findByIdAndUpdate(
      recipeId,
      updateValue,
      { new: true }
    );
    return updatdRecipe;
  } catch {
    console.log("Error in fetchng data from databse.");
  }
}

app.post("/recipe/difficulty/:recipeId", async (req, res) => {
  try {
    const recipe = await updateRecipeById(req.params.recipeId, req.body);
    if (recipe) {
      res.status(200).json({
        message: "Successfully Updated data.",
        Recipe: recipe,
      });
    } else {
      res.status(404).json({ error: "Failed to get data." });
    }
  } catch {
    res.status(500).json({ error: "Error connecting to databse." });
  }
});

//to update a recipe's prep time and cook time with the help of its title.
async function updateRecipeByTitle(
  recipeTitle,
  recipePrepTime,
  recipeCookTime
) {
  try {
    const updatdRecipe = await Recipes.findOneAndUpdate(
      { title: recipeTitle },
      { prepTime: recipePrepTime, cookTime: recipeCookTime },
      { new: true }
    );
    return updatdRecipe;
  } catch {
    console.log("Error in fetchng data from databse.");
  }
}

app.post("/recipe/Update/:recipeTitle", async (req, res) => {
  try {
    const { prepTime, cookTime } = req.body;
    const recipe = await updateRecipeByTitle(
      req.params.recipeTitle,
      prepTime,
      cookTime
    );
    if (recipe) {
      res.status(200).json({
        message: "Successfully Updated data.",
        Recipe: recipe,
      });
    } else {
      res.status(404).json({ error: "Recipe not found" });
    }
  } catch {
    res.status(500).json({ error: "Error connecting to databse." });
  }
});

//to delete a recipe with the help of a recipe id

async function deleteRecipeById(recipeId) {
  try {
    const recipe = await Recipes.findByIdAndDelete(recipeId);
    return recipe;
  } catch (error) {
    console.log("Error connecting to database.");
  }
}

app.delete("/recipe/:recipeId", async (req, res) => {
  try {
    const recipe = await deleteRecipeById(req.params.recipeId);
    if (recipe) {
      res.status(200).json({ message: "Recipe deleted successfully." });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch {
    res.status(500).json({ error: "Error connecting to databse." });
  }
});

// to check connection to port.
const PORT = 3000;
app.listen(PORT, () => console.log("Server is running on PORT:", PORT));
