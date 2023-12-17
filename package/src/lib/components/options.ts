

export function handleCacheControl(input:`${number}s` | `${number}h` | `${number}m` | `${number}d` ) {
    const regex = /^(\d+)([smhd])$/; // Regex to match patterns like '2s', '4h', '5m', '2d'
    const matches = input.match(regex);
  
    if (matches) {
      const value = parseInt(matches[1], 10); // Extract the numeric value
      const unit = matches[2]; // Extract the unit
  
      switch (unit) {
        case 's':
          return value; // Seconds
        case 'm':
          return value * 60; // Minutes to Seconds
        case 'h':
          return value * 60 * 60; // Hours to Seconds
        case 'd':
          return value * 24 * 60 * 60; // Days to Seconds
        default:
          throw new Error("Invalid Value for Cache Control , please use 1s or 1m or  1h or 1d ");
          // Return the original string if the unit is not recognized
      }
    } else {
      throw new Error("Invalid Value for Cache Control , please use 1s or 1m or  1h or 1d ");; // Return the original string if the input format doesn't match
    }
  }
