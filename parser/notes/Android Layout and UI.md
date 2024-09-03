# Android UI & Layout

### Intro: https://developer.android.com/courses/pathways/jetpack-compose-for-android-developers-2

  ```kotlin
    @Composable
    fun AndroidAlien(
        color: Color,
        modifier: Modifier = Modifier
    ) {
    Layout {
        Image()
        Layout {
            Modifier
                .clip()
                .size(40.dp)
                .clickable(...)
                .zoomable(...)
        }
    }
    }

    modifier: Modifier.maxSize()
    verticalAlignment: Alignment.Top
    horizontalArrangement: Arrangement.Center

        Modifier.weight(1F) // size weight

    Box (
        // Puts things on top of each other
        modifier = Modifier.FillMaxSize(),
        contentAlignment = Alignment.Center,
    ) {
        AndroidAliensRow()
        Spacer( modifier = Modifier
            .background(color = Color.Gray.copy(alpha = 0.7f))
            .matchParentSize()
                // This is only available in Box.
                // This is enforced by BoxScope Interface, which ensures that its children doesn't contain non-wanted modifiers
        ),
        Text(text = 'GAME OVER')
    }

        //Composables Material Components:
        //    Buttons
        //    Cards
        //    Switches
        //    Layouts

        Scaffold(
            // A common UI element for common screen elements
            floatingActionButtin = {

            }
            snackBarHost = { ... }
            drawerContent = { ... }
            topBar = { ... }
            bottomBar = { ... }
        )


        // Async data loading and lazy rendering
        fun AndroidAliensGrid(modifier: Modifier = Modifier) {
            LazyVerticalGrid(
                // LazyHorizontalGrid, LAzyColumn, LazyRow, Staggered grids: LazyVertical/HorizontalStaggeredGrid
                modifier = modifier
                columns = GridCells.Fixed(5)
            ) {
                // Renders scrollable, lazy rendered
                items(50) {
                    AndroidAlien(color = Color.Red)
                }
            }
        }
        ```




### Lazy Layouts: https://www.youtube.com/watch?v=1ANt65eoNhQ

  ```kotlin
    @Composable
    fun FlowerList(flowers: List<Flower>) {
        val state = rememberLazyListState()
        val coroutineScope = rememberCoroutineScope()
        // state.firstVisibleItemIndex
        // state.firstVisibleItemScrollOffset
        // state.layoutInfo -> visibleItemsInfo, totalItemsCount, etc.

        // This one will cause a LOOOOT of recomputation
        val showScrollToTopButtonInefficient = state.firstVisibleItemIndex > 0

        // This one will only recompute when the state.firstVisibleItemIndex changes
        val showScrollToTopButton by remember {
            derivedStateOf {
                state.firstVisibleItemIndex > 0
            }
        }

        LazyColumn {
            // Layout of items
            horizontalArrangement = Arrangement.spaceBy(8.dp)
            // When keeping track of scrolling
            item {
                Text(header)
            }
            items(flowers) { flower ->
                FlowerListItem(flower)
            }
            itemsIndexed(flowers) { index, flower ->
                FlowerListItem(flower).modifier(
                    Modifier.background(
                        color = if (index % 2 == 0) Color.White else Color.LightGray
                    )
                )
            }
            ScrollToTopButton(){
                onClick {
                     // DOesn't work. This is a suspend function
                    state.animateScrollToItem(index = 0)
                    // This works
                    coroutineScope.launch {
                        state.animateScrollToItem(index = 0)
                    }
                }
            }
        }

        let state = rememberLazyGridState()
        // state. -> firstVisibleItemIndex, firstVisibleItemScrollOffset, layoutInfo, etc
        // state. -> scrollToItem, animateScrollToItem, scrollBy, animateScrollBy, etc
        LazyVerticalGrid(
            state=state
            // Fixed not good for ipads
            columns = GridCells.Fixed(3)
            horizontalArrangement = Arrangement.SpaceBy(8.dp)
            // Flexible
            columns = GridCells.Adaptive(128.dp)
            // Or, variable
            columns = object : GridCells {
                override fun Density.calculateCrossAxisCellSizes(
                    availableSpace: Int,
                    spacing: Int
                ): List<Int> {
                    val firstColumn = (availableSpace - spacing) * 2 / 3
                    val secondColumn = availableSpace - spacing - firstColumn
                    return listOf(firstColumn, secondColumn)
                }
            }
        )

        // Item-specific rendered width
        LazyVerticalGrid(...) {
            // Conclusion: item is a scope function that allows for seperating between the per-item list-specific info and the properties of the rendered view.
            //              item does not have to have a corresponding view
            //             Why not put two ItemViews inside one item {...} block?
            //              The purpose of an item is: lazy-render all its content, so they would render together (e.g all elements in one item)
            //              Also, item() is the key to data Keys and view Indices, e.g for scrollToIndex etc.
            //              However, it could be useful to have some views NOT take up an Index, e.g. a divider or header.
            //                We can address this by putting the Divider in the same item as the previous item view.
            item(span = {
                GridItemSpan(
                    // !!!!!!!! This is a value that's available from the `span` lambda scope
                    maxLineSpan
                )
            })
            items(
                someSize,
                span = { GridItemSpan(if (it.isOdd) 2 else 1 ) } // Notice `it` is captured from the lambda scope
            ) { plant -> PlantCard(fruitPlants[it]) } // So much specialized syntax .. this is becoming a lot
        }

    }
    @Composable
    fun FlowerListItem(flower: Flower) {
        Column {
            Image(
                flower.image
                // painter = painterResource(id = flower.image),
                // contentDescription = null,
                // modifier = Modifier.size(50.dp)
            )
            Text(text = flower.name)
        }
    }

    // Animations
    LazyColumn {
        items(books, { key = it.id }) { book ->
            Row(Modifier.animateItemPlacement(
                tween(durationMillis = 500) // It feels like different things are done in different ways, and I can't see the pattern between them
                // Named parameters,
            )) {
                val rememberedValue = rememberSavable {  // rememberSavable so that it can be restored when the activity is created, or when you scroll away from this item and scroll back
                    Random.nextInt()
                }
            }
        }
    }

    // Animations of Additions and Removals
        // This is currently a Work In Progress

    // Conclusion: Make nested scrollable views in the same direction impossible



    // Create custom lazy layouts
    object TopWithFooter

    ```

    // List performance
    // As a clue to the performance optimization of reusing views, specify the item view type

      LazyColumn {
        items(flowers, contentType = { it.type }) { flower ->
            FlowerListItem(flower)
        }
      }

    // Also, Prefetching
      // Nothing needs to be done for this

### Text styles: https://www.youtube.com/watch?v=_qls2CEAbxI

```kotlin
    // Default text styles
    ///////////////////////

  // To allow for customizing default styles for a view hierarcy
  // This sets LocalTextStyle.current = set value.
  // In the definition of Text(), it uses LocalTextStyle.current as the default value
  ProvideTextStyle(value = MaterialTheme.typography.labelLarge) {
    Row { content ... }
  }

  // Truncating
  /////////////
  var showMore by remember { mutableStateOf(false) } // OPPORTUNITY: This is too much specifics

  Text(text, maxLines = 8, overlow = TextOverflow.Ellipsis,
    onTextLayout = {
        if (it.hasVisualOverflow) {
            // show button
        }
    }
  )

  // Automatically downloaded fonts, shared by different apps
  // This includes font fallback if font downloading fails
  var provider = GoogleFontProvider(...)
  var fontFamily = FontFamily(Font(googleFont= LobsterTwo, fontProvider = provider), ...)
  var typography = Typography(displayLarge = TextStyle(fontFamily = fontFamily, ...))
  // To pre-load:
  LaunchEffect...coroutineScope.launch(Dispatcher.IO) { provider.preloadFont(LobsterTwo) })

  // Annotated text - style sub-spans of the whole string
  buildAnnotatedString {
    var stringParts = splitUpTargetSubstring()
    var spanStyle = SpanStyle(color = Color.Red)
    append(stringParts[0])
    withStyle(spanStyle) {
      append(targetSubstr[1])
    }
    append(stringParts[2])
  }

  // Text field with label style changes
  OutlineTextField(
    value = text,
    onValueChange = { text = it },
    label = {Text("Label", style = MaterialTheme.typography.label)}
    colors = TextFieldDefaults.outlineTextFieldColors(
      focusedBorderColor = Color.Red,
      unfocusedBorderColor = Color.Gray
    )
    .border(border = BorderStroke(brush = Brush.linearGradient(listOf(Color.Red, Color.Blue)),
    shape = CutCornerShape(8.dp))
  )
```

### Animations: https://www.youtube.com/watch?v=0mfCbXrYBPE

  ```kotlin

    fun ToggleMessage(message:Message) {
        var expanded by remember { mutableStateOf(false) }
        Column {
            Text(message.title)
            // Toggled UI
            if (expanded) { Text(message.body) }
            // vs
            AnimatedVisibility(expanded) {
                Text(message.body)
            }
            // or expanded text
            Text("long message body", modifier = Modifier
                .animateContentSize(animationSpec = spring(dampingRatio = Spring.DampingRatioHighBouncy))
                .clickable { expanded = !expanded },
            maxLines = if (expanded) Int.MAX_VALUE else 2
            )
            // Action
            IconButton(onClick = { expanded = !expanded }) {
            Icon(Icons.Default.ArrowDropDown, contentDescription = "Expand")
            }
        }
    }

    // Animate between different screens content
    fun SearchContent(tabSelected: Screen) {
        AnimatedContent(
            targetState = tabSelected,
            transitionSpec = {
                // Slide in from the right
                slideInHorizontally(
                    initialOffsetX = { 1000 },
                    animationSpec = tween(500)
                ) with slideOutHorizontally(
                    targetOffsetX = { -1000 },
                    animationSpec = tween(500)
                )
            }
        ) { targetState ->
        when (targetState) {
                Screen.Home -> HomeContent()
                Screen.Search -> SearchContent()
                Screen.Profile -> ProfileContent()
            }
            }
    }

    // This also, it feels like there are soooooo many little details to remember!!
    // Are there ways to make all these things more availble through syntax?
    ```

### Custom Drawing

  I feel like Drawing is something to defer completely for now

  ```kotlin
  Space(Modifier.fillMaxSize().drawBehind {
    //this = DrawScope - a declarative, stateless drawing api without needing to maintain state
    drawCircle(Color.Magenta)
  })
  // drawBehind, drawWithConten, drawWithCache
  ```

### Advanced Layout

  ```kotlin
    // This may not be possible on all platforms.
    // Which would mean defer
  ```

### Understanding layout order and things

  1. Measure children
  2. Decide on own size
  3. Place children

  CONSTRAINTS are min and max size for the view, and constraints get passed down to children
