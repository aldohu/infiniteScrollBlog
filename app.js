const search = document.getElementById('search');
let currentPage = 1;
let currentPost = 1;

function isEndOfPage() {
	const scrollPosition = window.scrollY || window.pageYOffset;
	const documentHeight = document.documentElement.scrollHeight;
	const windowHeight = window.innerHeight;
	const scrolloffset = 1;
	console.log(scrollPosition, documentHeight, windowHeight, scrolloffset);

	return scrollPosition >= documentHeight - windowHeight - scrolloffset;
}
const updateDOM = (data) => {
	const htmlString = data
		.map((post) => {
			console.log(post);
			return `
			<div class="post">
				<h2 class="title">${post.title}</h2>
                <p class="postNum">${currentPost++}</p>
				<p>${post.body}</p>
			</div>
			`;
		})
		.join('');
	document.querySelector('.posts').insertAdjacentHTML('beforeend', htmlString);
};
async function loadMorePosts() {
	try {
		const response = await fetch(
			`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${currentPage}`,
		);
		const data = await response.json();
		console.log(data);
		// Process and display the retrieved data here
		updateDOM(data);
		if (data.length < 5) {
			// assuming 5 is the default limit
			hasMorePosts = false; // no more posts
		} else {
			currentPage++; // Increment the page for the next fetch
		}
	} catch (error) {
		console.log(error);
	}
}
window.addEventListener('load', loadMorePosts);
window.addEventListener('scroll', () => {
	if (isEndOfPage()) {
		{
			// wait for 2 seconds before logging the message
			setTimeout(() => {
				loadMorePosts();
			}, 2000);
		}
	}
});
function clearPosts() {
	const postsContainer = document.querySelector('.posts');
	postsContainer.innerHTML = ''; // Clear all child elements
	currentPage = 1; // Reset the current page
	currentPost = 1; // Reset the current post number
}
search.addEventListener('input', async (e) => {
	const term = e.target.value.toLowerCase();
	try {
		const response = await fetch(
			`https://jsonplaceholder.typicode.com/posts?q=${term}`,
		);
		const data = await response.json();
		clearPosts(); // Clear existing posts
		updateDOM(data); // Display the new search results
	} catch (error) {
		console.log(error);
	}
});
