# Cricket Scoring App 🏏

A simple and intuitive web-based cricket scoring application to track live cricket match scores.

## Features

- **Match Setup**: Configure team names and total overs
- **Live Scoring**: Track runs, wickets, and overs in real-time
- **Run Tracking**: Score 0, 1, 2, 3, 4, or 6 runs per ball
- **Extras**: Support for Wide, No Ball, Bye, and Leg Bye
- **Wicket Tracking**: Record dismissals with automatic ball counting
- **Over Display**: Visual representation of the current over
- **Two Innings**: Full support for both innings
- **Target Tracking**: Shows target and required run rate in second innings
- **Run Rate Calculation**: Automatic calculation of current and required run rates
- **Undo Functionality**: Undo the last action if a mistake is made
- **Match Summary**: Complete match result at the end

## How to Use

1. Open `index.html` in your web browser
2. Enter team names and total overs for the match
3. Click "Start Match" to begin
4. Use the buttons to record:
   - Runs scored (0-6)
   - Extras (Wide, No Ball, Bye, Leg Bye)
   - Wickets
5. Click "End Innings" to switch to the second innings
6. View the match summary when the match ends
7. Click "New Match" to start over

## Technical Details

- **HTML5**: Structure and layout
- **CSS3**: Modern, responsive styling with gradient backgrounds
- **JavaScript**: Game logic and state management
- **No Dependencies**: Pure vanilla JavaScript, no frameworks required

## Installation

No installation required! Simply open `index.html` in any modern web browser.

## File Structure

```
Score-App/
├── index.html    # Main HTML structure
├── styles.css    # Styling and layout
├── script.js     # Game logic and functionality
└── README.md     # Documentation
```

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Future Enhancements

Potential features for future versions:
- Player-wise statistics
- Ball-by-ball commentary
- Match history and saved scores
- Print scorecard functionality
- Mobile app version
