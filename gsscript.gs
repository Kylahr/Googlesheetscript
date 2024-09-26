 var row = range.getRow(); // Get the row number of the edited cell
    var column = range.getColumn(); // Get the column number of the edited cell
    Logger.log("onEdit triggered"); // Log when onEdit is triggered
    Logger.log("Edited range: " + range.getA1Notation()); // Log the edited cell
    Logger.log("Edited value: " + e.value); // Log the edited value
    // Check if the edit was made in column A and has a value
    if (column === 1 && e.value) { // Column A is the 1st column
      Logger.log("Correct column and value detected.");
      // Split the pasted string into parts
      var values = e.value.split("\t");
      Logger.log("Values split: " + values);
      // Define class colors for all WoW classes
      var classColors = {
        "Deathknight": "#C41E3A", // Red
        "Demonhunter": "#A330C9", // Purple
        "Druid": "#FF7C0A", // Orange
        "Evoker": "#33937F", // Teal
        "Hunter": "#AAD372", // Green
        "Mage": "#3FC7EB", // Light Blue
        "Monk": "#00FF96", // Jade Green
        "Paladin": "#F48CBA", // Pink
        "Priest": "#FFFFFF", // White
        "Rogue": "#FFF468", // Yellow
        "Shaman": "#0070DD", // Blue
        "Warlock": "#8787ED", // Purple
        "Warrior": "#C69B6D" // Tan/Brown
      };
      // Define colors based on the bonus level and completion status
      var statusColors = {
        "Bricked": "#F44336", // Red for Bricked
        "+0": "#b1ab00", // Yellow for Completed
        "+3": "#34ba00", // Deep Green for +3
        "+2": "#7ee409", // Light Green for +2
        "+1": "#beda05"  // Yellow-Green for +1
      };
      // Determine the appropriate status and color based on the BONUS column (values[5])
      var bonusValue = values[5]; // This should be the BONUS value (e.g., "Bricked", "+3", "+2", etc.)
      var statusColor = statusColors[bonusValue] || "#FFFFFF"; // Default to white if undefined
      Logger.log("Status: " + bonusValue);
      Logger.log("Status color: " + statusColor);
      // Define the destination range for columns A to U in the current row (1 row and 21 columns)
      var destinationRange = sheet.getRange(row, 1, 1, 21); // Columns 1-21 (A-U) in the current row
      var rowData = [];
      // Populate the first six columns (Date, Dungeon, Level, Time, Affixes, Bonus)
      for (var i = 0; i < 6; i++) {
        rowData.push(values[i] === "N/A" ? "" : values[i]); // Replace "N/A" with an empty string
      }
      // Start processing player information: Name, Realm, Class (3 columns for each player)
      var playerIndex = 6; // Starting index for players' data
      for (var i = playerIndex; i < values.length; i += 3) {
        var playerName = values[i] === "N/A" ? "" : values[i];
        var realmName = values[i + 1] === "N/A" ? "" : values[i + 1];
        var playerClass = values[i + 2] === "N/A" ? "" : values[i + 2];
        if (playerName) {
          // Add player name to the rowData
          rowData.push(playerName); // Name
          // Set realm as a tooltip if it exists
          var currentColumnIndex = rowData.length; // Current position in rowData (1-based index for setNote)
          if (realmName) {
            sheet.getRange(row, currentColumnIndex).setNote("Realm: " + realmName);
          }
          // Apply background color to name cell based on class if it exists
          if (playerClass && classColors[playerClass]) {
            sheet.getRange(row, currentColumnIndex).setBackground(classColors[playerClass]);
          }
        } else {
          // If there's no player name, add empty cells for Name
          rowData.push("");
        }
      }
      // Fill remaining columns with empty strings if not enough player data is available
      while (rowData.length < 21) {
        rowData.push("");
      }
      // Set the row data into the sheet (columns A-U)
      destinationRange.setValues([rowData]);
      // Apply status color to the cells A-F based on Bricked or Completed status
      sheet.getRange(row, 1, 1, 6).setBackground(statusColor);
      // Optional: Clear the input cell in column A (only if you want to clear it after processing)
      // sheet.getRange(row, 1).clearContent();
    } else {
      Logger.log("Edited cell is not in column A or has no value.");
    }
  } catch (error) {
    Logger.log("Error: " + error.message);
  }
}
