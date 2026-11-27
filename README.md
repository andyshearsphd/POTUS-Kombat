# POTUS Kombat

An early-90s arcade fighting game for phones in landscape, starring deceased US presidents. Built on the [Kombat Engine](https://github.com/andyshearsphd/kombat-engine) (pinned to 1.9.1 in `engine/`), with this game's content in `js/`.

## Progress

### Fighters (24 of 24 playable)

The select screen is four rows of six, in chronological order. The ladder draws 15 random opponents each run, and no single combo takes more than a quarter of the health bar.

| President | Specials | Fatality | Status |
| --- | --- | --- | --- |
| George Washington | Silver Dollar Skip, Cherry Tree Chop | Valley Forge Freeze | Done |
| Thomas Jefferson | Louisiana Purchase, Polygraph Double | Wall of Separation | Done |
| Andrew Jackson | Hickory Cane Beatdown, Spoils System | Old Hickory | Done |
| Abraham Lincoln | Rail Splitter, Stovepipe Boomerang | House Divided | Done |
| Ulysses S. Grant | Vicksburg Barrage, Cigar Cloud | Unconditional Surrender | Done |
| Grover Cleveland | Gold Standard, Nonconsecutive | Sheriff's Drop | Done |
| Teddy Roosevelt | Big Stick, Bull Moose Charge | Mounted Trophy | Done |
| FDR | Alphabet Soup, Four Freedoms Spin, Cigarette Holder Ember | New Deal | Done |
| William Howard Taft | Presidential Slam, Order in the Court | Fore! | Done |
| Calvin Coolidge | Rebecca the Raccoon, Keep Cool | Lamplight Oath | Done |
| Harry Truman | The Buck Stops Here, Give 'Em Hell | Dewey Defeats Truman | Done |
| JFK | Hyannis Spiral, Moon Shot Uppercut | Ask Not, We Choose the Moon, Bay of Pigs | Done |
| LBJ | The Johnson Treatment, Beagle Lift | All the Way | Done |
| Richard Nixon | Tape Reel Whip, White House Bowling | I Am Not a Crook | Done |
| Ronald Reagan | Star Wars Laser, Jelly Bean Spray | Tear Down This Wall | Done |
| Jimmy Carter | Peanut Barrage, Habitat Hammer | Peanut Grinder | Done |
| John Adams | Old Ironsides Broadside, Sedition Act (no specials for 3.5 seconds) | Midnight Judges | Done |
| William Henry Harrison | Inaugural Address, Hard Cider Barrel | Keep the Ball Rolling | Done |
| Dwight D. Eisenhower | D-Day Ramp, Interstate Charge | Interstate | Done |
| George H. W. Bush | Broccoli Bomb, Read My Lips | Birthday Jump | Done |
| James Madison | Bill of Rights, Dolley's Rescue | Checks and Balances | Done |
| Woodrow Wilson | Fourteen Points, Lawn Flock | Fleeced | Done |
| Herbert Hoover | Hoover-Ball, Engineer's Pick | Hoover Dam | Done |
| Gerald Ford | Wolverine Block, Pratfall | Airstair Tumble (against Nixon: a full pardon) | Done |

### Arenas (12, plus the boss stage to do)

Done: The Oval Office, Mount Rushmore (sculpted as a height map and lit by a low morning sun, so the carving casts real shadows), Valley Forge, Gettysburg, the Reflecting Pool, the Situation Room (generals and officials at the table, a wall of screens and world clocks), the Capitol Rotunda, Joint Session of Congress (the three-tier rostrum, the Mace, and the members rising to clap and cheer as the fight heats up), the Smithsonian, the Tidal Basin, the Staten Island Ferry (Lower Manhattan on one side, the Statue of Liberty on the other, at dusk), and Yosemite Valley from Tunnel View. To do: the boss-only Liberty Bell Chamber.

### Bosses (0 of 3)

To do: Liberty Bell Golem (sub-boss), Rushmore, King George III (final boss).

## Testing

Open `index.html?auto&p=<fighter index>&o=<opponent id>&s=oval` to jump straight into a fight.
