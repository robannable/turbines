# Original BASIC Source Code

## Wind Turbine Blade Design Program

This is the original BASIC computer program that forms the mathematical foundation of this modern web application. Written by **Hugh Piggott** and published in his book *"Scrapyard Windpower Realities"*, this program has been helping DIY wind turbine builders design efficient blades for over 30 years.

### About This Code

**What is BASIC?** BASIC (Beginner's All-purpose Symbolic Instruction Code) was a popular programming language in the 1970s-1990s. This code would have been typed into early home computers like the Commodore 64, Apple II, or early PCs.

**Why preserve this?** This program represents practical, field-tested engineering knowledge. While we've modernized the interface, the core mathematics remain valid and are still used in our web calculator.

**Historical Context:** Hugh Piggott is a pioneer in small-scale wind power and has helped thousands of people worldwide build their own wind turbines using recycled materials ("scrapyard" parts).

---

## The Original Program

*Extract from 'Scrapyard Windpower Realities' by Hugh Piggott*



10 PRINT"THIS PROGRAM WILL DESIGN YOUR PROPELLER": PRINT
20 INPUT"TIP SPEED RATIO "; TSR
25 IF TSR>15 THEN PRINT "That's ambitious!"
30 INPUT"NUMBER OF BLADES "; B
35 IF TSR*B>24 THEN PRINT "Too many blades?"
40 PRINT: PRINT" CHOOSE: "
50 PRINT"1.FIND BEST DIAMETER TO MATCH GENERATOR"
60 PRINT"2.CHOOSE YOUR OWN DIAMETER"
70 INPUT a$
80 A=VAL(A$): ON A GOSUB 100,200
90 END 
100 PRINT"FINDING BEST DIAMETER"
110 INPUT"GENERATOR RATED POWER (watts) ";P
120 INPUT"GENERATOR RATED RPM "; RPM
130 INPUT "GEAR RATIO (enter 1 for direct drive)"; RAT
140 RPM=RPM/RAT
150 D=(P*(47*TSR/RPM)^3)^0.2
160 PRINT"DIAMETER IS ";:PRINT D;: PRINT" meters"
165 IF RPM*D>1800 THEN PRINT" *High tip speed-BEWARE EROSION*"
170 PRINT"RATED WINDSPEED IS ";:PRINT RPM*D/20/TSR; : PRINT" m/s"
175 IF RPM*D/TSR>260 THEN PRINT "Try some gearing."
180 PRINT"TORQUE at 3m/s windspeed=";:PRINT 9*D^3/10/TSR^2; : PRINT " Newton metres"
190 GOSUB 210
195 RETURN 
200 INPUT"DIAMETER (meters) ";D
210 INPUT"NUMBER OF STATIONS ";N
220 PRINT"RADIUS SETTING CHORD  WIDTH  'DROP'  THICKNESS"
225 PRINT"meters degrees meters meters meters   meters"
230 FOR X=1 TO N
240  R=D/2/N*X:VAR=R:GOSUB 500
250  FLO=ATN(D/3/TSR/R):VAR=57*FLO-3:GOSUB 500
260  CH=1.7*D^2/B/R/TSR^2*COS(FLO)^2:VAR=CH:GOSUB 500
265  WD=CH*COS(FLO-3/57):VAR=WD:GOSUB 500
270  DP=CH*SIN(FLO-3/57):VAR=DP:GOSUB 500
280  TH=CH/(5+X*3/N):VAR=TH:GOSUB 500
290  PRINT 
300 NEXT X
305 PRINT"WIDTH is the width of the wood during tapering."
310 PRINT"'DROP' is the measurement for 'angling the blade'."
320 RETURN
500 REM printing subroutine
510 VAR=INT(VAR*1000)/1000 
520 VAR$=STR$(VAR)
530 FOR S=1 TO (10-LEN(VAR$)):PRINT" ";: NEXT S
540 PRINT VAR$;
560 RETURN

---

## Understanding the Program

**For Non-Programmers:** Here's what this code does, step by step:

### Main Flow:
1. **Lines 10-30:** Ask the user for basic parameters (TSR, number of blades)
2. **Lines 40-70:** Present a menu - either match a generator or choose your own diameter
3. **Lines 100-195:** If matching generator, calculate the optimal diameter
4. **Lines 200-320:** Calculate and display the blade dimensions station by station

### Key Calculations:

**Line 150:** The diameter formula
```
D = (P * (47 * TSR / RPM)³)^0.2
```
This determines how big your turbine should be based on your generator's power (P) and speed (RPM).

**Line 240:** Radius for each station
- Divides the blade into N equal sections

**Line 250:** Setting angle (twist) at each station
```
FLO = arctan(D / 3 / TSR / R)
```
Calculates how much to twist the blade at each point for optimal wind capture.

**Line 260:** Chord (blade width) at each station
```
CH = 1.7 * D² / B / R / TSR² * cos(FLO)²
```
Wider near the hub, narrower at the tip - this is the characteristic tapered shape.

**Lines 265-280:** Width, drop, and thickness measurements
- These are the actual dimensions you need for carving/building the blade

### Safety Warnings in the Code:

- **Line 25:** TSR > 15 = "That's ambitious!" (too fast, risky)
- **Line 35:** TSR × Blades > 24 = "Too many blades?" (creates too much drag)
- **Line 165:** Tip speed > 90 m/s = Erosion warning (rain and dust damage)
- **Line 175:** Hub speed < 13 m/s = "Try some gearing" (generator won't work efficiently)

### Units Used:
- Power: Watts
- Speed: meters per second (m/s)
- Distance: meters
- Torque: Newton-metres
- Angles: degrees

---

## Modern Update

While Hugh Piggott notes this program has been "undoubtedly superseded by more current designs," the fundamental mathematics remain sound for small-scale DIY wind turbines. Our modern web application:

- Uses the same proven formulas
- Adds real-time validation and warnings
- Provides 3D visualization
- Offers multiple export formats
- Includes the NACA 4412 airfoil profile for better aerodynamics

**Learn More:** Visit Hugh Piggott's website for his complete collection of books and resources:
http://scoraigwind.co.uk/all-of-the-books-by-hugh-how-to-get-them/

**Acknowledgment:** We are grateful to Hugh Piggott for pioneering accessible small-scale wind power technology and making this knowledge freely available to the DIY community.
