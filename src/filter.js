import noUiSlider from "nouislider";
import styles from "../node_modules/nouislider/distribute/nouislider.min.css";

const mid = () =>
	Array.from(document.getElementsByTagName("script"))
		.map(el => el.firstChild)
		.filter(el => el !== null)
		.map(el => el.textContent)
		.filter(s => s.includes("mid = "))[0]
		.split("\n")
		.filter(s => s.includes("mid = "))[0]
		.split("'")[1];

const url = () =>
	"https://www.ukclimbing.com/logbook/liveclimbs.php?mid=" + mid() + "&sort=g";

const gradeHumanEyes = s =>
	s
		.replace(/\*/g, "")
		.replace(/\n\s+/, "")
		.replace(/\s+$/, "")
		.replace(/  /g, " ");

const fetchOK = (url, headers) => {
	return fetch(url, headers).then(response => {
		if (response.status < 400) return response;
		else throw new Error(response.statusText);
	});
};

const orderedTableRequest = async () =>
	await fetchOK(url(), {
		credentials: "include",
		headers: {
			Accept: "text/html, */*; q=0.01",
			"Accept-Language": "en-US,en;q=0.5",
			"X-Requested-With": "XMLHttpRequest"
		},
		referrer: document.baseURI,
		method: "GET",
		mode: "cors"
	});

const gradeList = async () =>
	orderedTableRequest() // error handling incase this shits the bed
		.then(res => res.text())
		.then(html => {
			let table = document.createElement("div");
			table.innerHTML = html;
			return table;
		})
		.then(table => table.getElementsByTagName("tr"))
		.then(htmlCollection => Array.from(htmlCollection))
		.then(array => array.map(tr => tr.children[4]))
		.then(array => array.filter(el => el.nodeName === "TD"))
		.then(array => array.map(td => td.innerText))
		.then(array => array.map(gradeHumanEyes))
		.then(array => new Set(array))
		.then(set => [...set])
		.catch(console.log);

const climbsArray = () => [...document.getElementsByClassName("climb")];

const gradeTest = (el, gradeString) =>
	gradeHumanEyes(el.children[4].innerText) === gradeString;

const rangeTest = (el, rangeArray) =>
	rangeArray.some(grade => gradeTest(el, grade));

const filterClimbs = (climbsArray, rangeArray) => {
	climbsArray.forEach(el => {
		if (rangeTest(el, rangeArray)) {
			el.hidden = false;
		} else {
			el.hidden = true;
		}
	});
};

const sliderVals = array => array[2].map(x => Math.floor(x));

const darkTheme = () =>
	window.matchMedia &&
	window.matchMedia("(prefers-color-scheme: dark)").matches;

gradeList().then(list => {
	let slider = document.createElement("div");

	noUiSlider.create(slider, {
		start: [0, list.length - 1],
		step: 1,
		tooltips: [
			{
				to: value => list[Math.floor(value)]
			},
			{
				to: value => list[Math.floor(value)]
			}
		],
		range: {
			min: [0],
			max: [list.length - 1]
		}
	});

	slider.noUiSlider.on("change", (...args) => {
		const [min, max] = sliderVals(args);
		filterClimbs(climbsArray(), list.slice(min, max));
	});

	slider.style.marginTop = "50px";
	slider.style.marginBottom = "25px";

	browser.runtime.onMessage.addListener(message => {
		if (message === "filter")
			document
				.getElementById("climbs")
				.insertAdjacentElement("afterend", slider);
	});
});

browser.runtime.onMessage.addListener(message => {
	if (message === "darkTheme")
		return Promise.resolve({ darkTheme: darkTheme() });
});
