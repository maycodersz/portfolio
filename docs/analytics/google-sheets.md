# Website Visitor Analytics sheet contract

The spreadsheet intentionally keeps only information that is useful for understanding portfolio traffic. It does not store full IP addresses, IP hashes, user-agent strings, browser versions, operating systems, referrer URLs, target URLs, form values, or arbitrary page content.

## Events (source of truth)

Create an `Events` tab and paste this header row into cell A1:

```text
Date and Time (Manila)	Visitor ID	Session ID	Record Type	Page	Action	Click Label	Language	Timezone	City	Region	Country	Source	Campaign	Device	Bot	Event ID
```

The 17 readable columns are:

1. Date and Time (Manila)
2. Visitor ID
3. Session ID
4. Record Type (`visit` or `event`)
5. Page
6. Action
7. Click Label
8. Language
9. Timezone
10. City
11. Region
12. Country
13. Source
14. Campaign
15. Device (`mobile`, `tablet`, or `desktop`)
16. Bot
17. Event ID (used only to prevent duplicate rows)

City, region, and country are approximate values supplied to the Vercel Function by Vercel. Empty values are valid, especially during local development.

## Visitors (readable summary)

Create a `Visitors` tab and paste this header row into cell A1:

```text
Visitor ID	First Seen	Latest Seen	Sessions	Page Views	Clicks	Language	Timezone	City	Country	First Source	Latest Source	Latest Page	Latest Action	Device
```

The Vercel Function rebuilds the matching visitor from `Events` before it appends or updates this 15-column summary.

## Dashboard formulas

Create a `Dashboard` tab. These formulas scan at most 100,000 rows and exclude bots.

```gs
Unique visitors today
=IFERROR(COUNTUNIQUE(FILTER(Events!B2:B100000,LEFT(Events!A2:A100000,10)=TEXT(TODAY(),"yyyy-mm-dd"),Events!P2:P100000<>TRUE)),0)

Unique visitors this week
=IFERROR(COUNTUNIQUE(FILTER(Events!B2:B100000,DATEVALUE(LEFT(Events!A2:A100000,10))>=TODAY()-WEEKDAY(TODAY(),2)+1,Events!P2:P100000<>TRUE)),0)

Page views today
=COUNTIFS(Events!D2:D100000,"visit",Events!A2:A100000,TEXT(TODAY(),"yyyy-mm-dd")&"*",Events!P2:P100000,"<>TRUE")

Clicks today
=COUNTIFS(Events!D2:D100000,"event",Events!A2:A100000,TEXT(TODAY(),"yyyy-mm-dd")&"*",Events!P2:P100000,"<>TRUE")

Top pages
=QUERY(FILTER(Events!E2:E100000,Events!P2:P100000<>TRUE),"select Col1,count(Col1) where Col1 is not null group by Col1 order by count(Col1) desc limit 10",0)

Top sources
=QUERY(FILTER(Events!M2:M100000,Events!P2:P100000<>TRUE),"select Col1,count(Col1) where Col1 is not null group by Col1 order by count(Col1) desc limit 10",0)

Top countries
=QUERY(FILTER(Events!L2:L100000,Events!P2:P100000<>TRUE),"select Col1,count(Col1) where Col1 is not null group by Col1 order by count(Col1) desc limit 10",0)

Top CTA labels
=QUERY(FILTER(Events!G2:G100000,Events!P2:P100000<>TRUE),"select Col1,count(Col1) where Col1 is not null group by Col1 order by count(Col1) desc limit 10",0)
```

The API writes with `valueInputOption=RAW`, validates every field, formula-escapes text, and checks the Event ID before retrying an ambiguous append.
