// Utility functions for handling recently viewed recipes

// Maximum number of recently viewed recipes to store
const MAX_RECENTLY_VIEWED = 10;

/**
 * Add a recipe to recently viewed
 * @param {Object} recipe - Recipe object containing id, title, image, readyInMinutes, and servings
 */
function addToRecentlyViewed(recipe) {
    // Get current recently viewed recipes
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    // Remove the recipe if it already exists (to avoid duplicates)
    recentlyViewed = recentlyViewed.filter(r => r.id !== recipe.id);
    
    // Add the new recipe to the beginning of the array
    recentlyViewed.unshift({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings
    });
    
    // Keep only the most recent MAX_RECENTLY_VIEWED recipes
    recentlyViewed = recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
    
    // Save back to localStorage
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

/**
 * Get all recently viewed recipes
 * @returns {Array} Array of recently viewed recipes
 */
function getRecentlyViewed() {
    return JSON.parse(localStorage.getItem('recentlyViewed')) || [];
}

/**
 * Clear all recently viewed recipes
 */
function clearRecentlyViewed() {
    localStorage.removeItem('recentlyViewed');
}

/**
 * Display recently viewed recipes in a grid
 * @param {string} containerId - ID of the container element to display recipes in
 */
function displayRecentlyViewed(containerId) {
    const recentlyViewed = getRecentlyViewed();
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    if (recentlyViewed.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👀</div>
                <div class="empty-state-text">
                    No recently viewed recipes yet.<br>
                    Start exploring recipes to see your history!
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentlyViewed.map((recipe, index) => `
        <div class="recipe-card" style="animation-delay: ${index * 0.1}s">
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
            <div class="recipe-info">
                <h3 class="recipe-name">${recipe.title}</h3>
                <div class="recipe-meta">
                    <span>⏱️ ${recipe.readyInMinutes} mins</span>
                    <span>👥 ${recipe.servings} servings</span>
                </div>
                <a href="#" class="view-recipe-btn" onclick="showRecipeDetails(${recipe.id})">View Recipe</a>
            </div>
        </div>
    `).join('');
}

/**
 * Show recipe details and add to recently viewed
 * @param {number} recipeId - ID of the recipe to show
 */
async function showRecipeDetails(recipeId) {
    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=e86d004092814e04ad5d9545378e04ab`
        );
        
        if (!response.ok) throw new Error('Recipe info fetch failed');
        const recipe = await response.json();
        
        // Add to recently viewed
        addToRecentlyViewed(recipe);
        
        // Store current recipe for details page
        localStorage.setItem('currentRecipe', JSON.stringify(recipe));
        window.location.href = 'recipe-details.html';
    } catch (error) {
        console.error("Error showing recipe details:", error);
        alert('Error loading recipe details. Please try again.');
    }
} 