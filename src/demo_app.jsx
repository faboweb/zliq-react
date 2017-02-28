import { h } from './utils/streamy-hyperscript';
import { reduxy } from './utils/reduxy';
import { easyFetch } from './utils/fetch-helper';
import { stream, merge$} from './utils/streamy';
import { clicks, CLICK } from './reducers/clicks';
import { CleverComponent, DumbComponent, SuperDumbComponent } from './demo_component.jsx';

// create the store providing reducers
let store = reduxy({
	clicks
});

// main render function for the application
// render provided hyperscript into a parent element
let app =
	<div id='foo' class='bar'>
		<p class={store.$('clicks.clicks').map(clicks => 'clicks-' + clicks)}
			style={{
				'color': store.$('clicks.clicks').map(clicks => clicks > 0 ? 'red' : 'blue')
			}}><SuperDumbComponent /></p>
		<button onclick={e => store.dispatch({ type: CLICK })}>Click To Count</button>
		<p>{store.$('clicks.clicks')}</p>
		<hr />
		<button onclick={e => fetchStuff()}>Fetch Quote</button>
		<p>{store.$('clicks.fetched').map(payload => !payload ? null : JSON.stringify(payload))}</p>
		<hr />
		<CleverComponent sinks={{store}} />
		<DumbComponent sinks={{store, clicks: store.$('clicks.clicks')}} />
	</div>;
document.querySelector('app').appendChild(app);

function fetchStuff() {
	easyFetch(store, null)({
		method: 'GET',
		url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1'
	}, 'FETCHED');
}