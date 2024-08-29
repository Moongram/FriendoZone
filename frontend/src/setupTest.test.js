import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import MainHeader from './components/MainHeader';
import React from 'react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect'; 
import MainPage from './pages/Main';
import ProfilePage from './pages/Profile';
import '@testing-library/jest-dom/extend-expect';


describe('Test Auth', () => {
  const mockNavigate = jest.fn();
  it('should log in a previously registered user', async () => {
    
    render(
      <Router>
        <LoginForm navigate={mockNavigate}/>
      </Router>
    );

    // test default login state is false
    expect(screen.queryByText('Welcome, User!')).not.toBeInTheDocument();

    fireEvent.change(screen.getByTestId('Username'), { target: { value: 'Bret' } });
    fireEvent.change(screen.getByTestId('Password'), { target: { value: 'Kulas Light' } });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(screen.queryByText('Invalid username or password!')).not.toBeInTheDocument();
    });
    // test login state should be set
    expect(screen.queryByText('Welcome, User!')).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/main', {
      state: {
        userData: {
          "id": 1,
          "name": "Leanne Graham",
          "username": "Bret",
          "email": "Sincere@april.biz",
          "address": {
            "street": "Kulas Light",
            "suite": "Apt. 556",
            "city": "Gwenborough",
            "zipcode": "92998-3874",
            "geo": {
              "lat": "-37.3159",
              "lng": "81.1496"
            }
          },
          "phone": "1-770-736-8031 x56442",
          "website": "hildegard.org",
          "company": {
            "name": "Romaguera-Crona",
            "catchPhrase": "Multi-layered client-server neural-net",
            "bs": "harness real-time e-markets"
          }
        }
        },
      },
    );
  });
});


describe('Test Auth', () => {
  it('should not log in an invalid user', async () => {
    render(
      <Router>
        <LoginForm/>
      </Router>
    );

    // test initial error state to be false
    expect(screen.queryByText('Invalid username or password!')).not.toBeInTheDocument();

    fireEvent.change(screen.getByTestId('Username'), { target: { value: 'invalid' } });
    fireEvent.change(screen.getByTestId('Password'), { target: { value: 'Password' } });
    fireEvent.click(screen.getByTestId('login-button'));

    // test error state to be set
    await waitFor(() => {
      expect(screen.queryByText('Invalid username or password!')).toBeInTheDocument();
    });
  });
});

describe('Test Auth', () => {
  const mockNavigate = jest.fn();

  it('should log out a user', async () => {
    render(
      <Router>
        <MainHeader navigate={mockNavigate}/>
      </Router>
    );

    // test initial login state is true
    expect(screen.queryByText('logout state true')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('logout-button'));
      
    // test login state is cleared
    expect(screen.queryByText('logout state true')).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/')
  });
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(), 
}))
describe('Test Article', () => {
  it('should fetch articles for current logged in user', async () => {
    const userData = {
      "id": 1,
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz",
      "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874",
        "geo": {
          "lat": "-37.3159",
          "lng": "81.1496"
        }
      },
      "phone": "1-770-736-8031 x56442",
      "website": "hildegard.org",
      "company": {
        "name": "Romaguera-Crona",
        "catchPhrase": "Multi-layered client-server neural-net",
        "bs": "harness real-time e-markets"
      }
    }; 
    const mockLocation = {
      state: { userData },
    };

    useLocation.mockReturnValue(mockLocation);

    await act(async () => {
      render(
        <Router>
          <MainPage />
        </Router>
      );
    });


    // Test that posts state is set
    expect(screen.getByTestId('user-posts').children).toHaveLength(40);
    // One of Bret's post title
    expect(screen.queryByText('nesciunt iure omnis dolorem tempora et accusantium')).toBeInTheDocument();
  });
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(), 
}))
describe('Test Article', () => {
  it('should filter displayed articles by the search keyword', async () => {
    const userData = {
      "id": 1,
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz",
      "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874",
        "geo": {
          "lat": "-37.3159",
          "lng": "81.1496"
        }
      },
      "phone": "1-770-736-8031 x56442",
      "website": "hildegard.org",
      "company": {
        "name": "Romaguera-Crona",
        "catchPhrase": "Multi-layered client-server neural-net",
        "bs": "harness real-time e-markets"
      }
    }; 
    const mockLocation = {
      state: { userData },
    };

    useLocation.mockReturnValue(mockLocation);

    await act(async () => {
      render(
        <Router>
          <MainPage />
        </Router>
      );
    });

    // Initial post state
    expect(screen.getByTestId('user-posts').children).toHaveLength(40);

    const searchInput = screen.getByTestId('search-test');
    fireEvent.change(searchInput, { target: { value: 'Bret' } });

    // Test that post state is smaller (filterd)
    expect(screen.getByTestId('user-posts').children).toHaveLength(10);

  });
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(), 
}))
describe('Test Article', () => {
  it('should add articles when adding a follower', async () => {
    const userData = {
      "id": 1,
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz",
      "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874",
        "geo": {
          "lat": "-37.3159",
          "lng": "81.1496"
        }
      },
      "phone": "1-770-736-8031 x56442",
      "website": "hildegard.org",
      "company": {
        "name": "Romaguera-Crona",
        "catchPhrase": "Multi-layered client-server neural-net",
        "bs": "harness real-time e-markets"
      }
    }; 
    const mockLocation = {
      state: { userData },
    };

    useLocation.mockReturnValue(mockLocation);

    await act(async () => {
      render(
        <Router>
          <MainPage />
        </Router>
      );
    });


    // Initial post state
    expect(screen.getByTestId('user-posts').children).toHaveLength(40);
    fireEvent.change(screen.getByTestId('add-follower-name'), { target: { value: 'Delphine' } });
    fireEvent.click(screen.getByTestId('add-follower'));
    await waitFor(() => {});
    // Test that post state is larger
    expect(screen.getByTestId('user-posts').children).toHaveLength(50);
  

  });
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(), 
}))
describe('Test Article', () => {
  it('should remove articles when removing a follower', async () => {
    const userData = {
      "id": 1,
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz",
      "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874",
        "geo": {
          "lat": "-37.3159",
          "lng": "81.1496"
        }
      },
      "phone": "1-770-736-8031 x56442",
      "website": "hildegard.org",
      "company": {
        "name": "Romaguera-Crona",
        "catchPhrase": "Multi-layered client-server neural-net",
        "bs": "harness real-time e-markets"
      }
    }; 
    const mockLocation = {
      state: { userData },
    };

    useLocation.mockReturnValue(mockLocation);

    await act(async () => {
      render(
        <Router>
          <MainPage />
        </Router>
      );
    });

    // Initial post state
    expect(screen.getByTestId('user-posts').children).toHaveLength(40);
    fireEvent.click(screen.getByTestId('unfollow-2'));
    await waitFor(() => {});
  
    // Test that post state is smaller
    expect(screen.getByTestId('user-posts').children).toHaveLength(30);
  });
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(), 
}));
describe("Test Profile", () => {
  it("should fetch the user's profile username", () => {
    const mockUserData = {
      username: "testUser",
      email: "test@email.com",
      phone: "123-123-1234",
      address: {
        zipcode: "12345",
        street: "test street",
      },
    };
    const mockLocation = {
      state: { userData: mockUserData  },
    };

    useLocation.mockReturnValue(mockLocation);


    render(
      <Router>
        <ProfilePage  />
      </Router>
    );

    const displayedUsername = screen.getByText(mockUserData.username);
    expect(displayedUsername).toBeInTheDocument();
  });
});







