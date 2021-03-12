import App from './App';
import { MemoryRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';

it.skip('renders without crashing', async () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <App />
    </MemoryRouter>, div);
  await new Promise(resolve => setTimeout(resolve, 1000));
});
