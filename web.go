 p a c k a g e   m a i n  
  
 i m p o r t   (  
 	 " b y t e s "  
 	 " e n c o d i n g / j s o n "  
 	 " f l a g "  
 	 " f m t "  
 	 l o g   " g i t h u b . c o m / S i r u p s e n / l o g r u s "  
 	 " g i t h u b . c o m / a n t a g e / e v e n t s o u r c e "  
 	 " g i t h u b . c o m / b w m a r r i n / d i s c o r d g o "  
 	 " g i t h u b . c o m / g o r i l l a / h a n d l e r s "  
 	 " g i t h u b . c o m / g o r i l l a / s e s s i o n s "  
 	 " g o l a n g . o r g / x / o a u t h 2 "  
 	 r e d i s   " g o p k g . i n / r e d i s . v 3 "  
 	 " i o / i o u t i l "  
 	 " m a t h / r a n d "  
 	 " n e t / h t t p "  
 	 " o s "  
 	 " s t r c o n v "  
 	 " t i m e "  
 )  
  
 v a r   (  
 	 / /   P e r m i s s i o n   C o n s t a n t s  
 	 R E A D _ M E S S A G E S   =   1 0 2 4  
 	 S E N D _ M E S S A G E S   =   2 0 4 8  
 	 C O N N E C T               =   1 0 4 8 5 7 6  
 	 S P E A K                   =   2 0 9 7 1 5 2  
  
 	 / /   R e d i s   c l i e n t   ( f o r   s t a t s )  
 	 r c l i   * r e d i s . C l i e n t  
  
 	 / /   O a u t h 2   C o n f i g  
 	 o a u t h C o n f   * o a u t h 2 . C o n f i g  
  
 	 / /   U s e d   f o r   s t o r i n g   s e s s i o n   i n f o r m a t i o n   i n   a   c o o k i e  
 	 s t o r e   * s e s s i o n s . C o o k i e S t o r e  
  
 	 / /   U s e d   f o r   p u s h i n g   l i v e   s t a t   u p d a t e s   t o   t h e   c l i e n t  
 	 e s   e v e n t s o u r c e . E v e n t S o u r c e  
  
 	 / /   S o u r c e   o f   t h e   H T M L   p a g e   ( c a c h e d   i n   m e m o r y   f o r   p e r f o r m a n c e )  
 	 h t m l I n d e x P a g e   s t r i n g  
  
 	 / /   B a s e   U R L   o f   t h e   d i s c o r d   A P I  
 	 a p i B a s e U r l   =   " h t t p s : / / d i s c o r d a p p . c o m / a p i "  
 )  
  
 / /   R e p r e s e n t s   a   J S O N   s t r u c t   o f   s t a t s   t h a t   a r e   u p d a t e d   e v e r y   s e c o n d   a n d   p u s h e d   t o   t h e   c l i e n t  
 t y p e   C o u n t U p d a t e   s t r u c t   {  
 	 T o t a l                     s t r i n g   ` j s o n : " t o t a l " `  
 	 U n i q u e U s e r s         s t r i n g   ` j s o n : " u n i q u e _ u s e r s " `  
 	 U n i q u e G u i l d s       s t r i n g   ` j s o n : " u n i q u e _ g u i l d s " `  
 	 U n i q u e C h a n n e l s   s t r i n g   ` j s o n : " u n i q u e _ c h a n n e l s " `  
 	 S e c r e t C o u n t         s t r i n g   ` j s o n : " s e c r e t _ c o u n t " `  
 }  
  
 f u n c   ( c   * C o u n t U p d a t e )   T o J S O N ( )   [ ] b y t e   {  
 	 d a t a ,   _   : =   j s o n . M a r s h a l ( c )  
 	 r e t u r n   d a t a  
 }  
  
 f u n c   N e w C o u n t U p d a t e ( )   * C o u n t U p d a t e   {  
 	 v a r   (  
 	 	 t o t a l C m d     * r e d i s . S t r i n g C m d  
 	 	 u s e r s C m d     * r e d i s . I n t C m d  
 	 	 g u i l d s C m d   * r e d i s . I n t C m d  
 	 	 c h a n s C m d     * r e d i s . I n t C m d  
 	 	 s e c r e t C m d   * r e d i s . S t r i n g C m d  
 	 )  
  
 	 / /   M a k e   a   p i p e l i n e d   r e q u e s t   t o   r e d i s   f o r   a l l   t h e   c o u n t e r   v a l u e s  
 	 e r r o r s ,   e r r   : =   r c l i . P i p e l i n e d ( f u n c ( p i p e   * r e d i s . P i p e l i n e )   e r r o r   {  
 	 	 t o t a l C m d   =   p i p e . G e t ( " a i r h o r n : a : t o t a l " )  
 	 	 u s e r s C m d   =   p i p e . S C a r d ( " a i r h o r n : a : u s e r s " )  
 	 	 g u i l d s C m d   =   p i p e . S C a r d ( " a i r h o r n : a : g u i l d s " )  
 	 	 c h a n s C m d   =   p i p e . S C a r d ( " a i r h o r n : a : c h a n n e l s " )  
 	 	 s e c r e t C m d   =   p i p e . G e t ( " a i r h o r n : a : s o u n d : t r u c k " )  
 	 	 r e t u r n   n i l  
 	 } )  
  
 	 / /   G e n e r a l l y   t h i s   i s   n o t   a   h u g e   d e a l ,   l e t s   t r y   t o   c o n t i n u e   o n  
 	 i f   e r r   ! =   n i l   {  
 	 	 l o g . W i t h F i e l d s ( l o g . F i e l d s {  
 	 	 	 " e r r o r " :     e r r ,  
 	 	 	 " e r r o r s " :   e r r o r s ,  
 	 	 } ) . W a r n i n g ( " F a i l e d   t o   g e t   a   c o u n t   u p d a t e   f r o m   r e d i s " )  
 	 }  
  
 	 s e c r e t C o u n t   : =   s e c r e t C m d . V a l ( )  
 	 i f   s e c r e t C o u n t   = =   " "   {  
 	 	 s e c r e t C o u n t   =   " 0 "  
 	 }  
  
 	 r e t u r n   & C o u n t U p d a t e {  
 	 	 T o t a l :                     t o t a l C m d . V a l ( ) ,  
 	 	 U n i q u e U s e r s :         s t r c o n v . F o r m a t I n t ( u s e r s C m d . V a l ( ) ,   1 0 ) ,  
 	 	 U n i q u e G u i l d s :       s t r c o n v . F o r m a t I n t ( g u i l d s C m d . V a l ( ) ,   1 0 ) ,  
 	 	 U n i q u e C h a n n e l s :   s t r c o n v . F o r m a t I n t ( c h a n s C m d . V a l ( ) ,   1 0 ) ,  
 	 	 S e c r e t C o u n t :         s e c r e t C m d . V a l ( ) ,  
 	 }  
 }  
  
 v a r   l e t t e r s   =   [ ] r u n e ( " a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z " )  
  
 / /   R e t u r n   a   r a n d o m   c h a r a c t e r   s e q u e n c e   o f   n   l e n g t h  
 f u n c   r a n d S e q ( n   i n t )   s t r i n g   {  
 	 b   : =   m a k e ( [ ] r u n e ,   n )  
 	 f o r   i   : =   r a n g e   b   {  
 	 	 b [ i ]   =   l e t t e r s [ r a n d . I n t n ( l e n ( l e t t e r s ) ) ]  
 	 }  
 	 r e t u r n   s t r i n g ( b )  
 }  
  
 / /   R e t u r n s   t h e   c u r r e n t   s e s s i o n   o r   a b o r t s   t h e   r e q u e s t  
 f u n c   g e t S e s s i o n O r A b o r t ( w   h t t p . R e s p o n s e W r i t e r ,   r   * h t t p . R e q u e s t )   * s e s s i o n s . S e s s i o n   {  
 	 s e s s i o n ,   e r r   : =   s t o r e . G e t ( r ,   " s e s s i o n " )  
  
 	 i f   s e s s i o n   = =   n i l   {  
 	 	 l o g . W i t h F i e l d s ( l o g . F i e l d s {  
 	 	 	 " e r r o r " :   e r r ,  
 	 	 } ) . E r r o r ( " F a i l e d   t o   g e t   s e s s i o n " )  
 	 	 h t t p . E r r o r ( w ,   " I n v a l i d   o r   c o r r u p t e d   s e s s i o n " ,   h t t p . S t a t u s I n t e r n a l S e r v e r E r r o r )  
 	 	 r e t u r n   n i l  
 	 }  
  
 	 r e t u r n   s e s s i o n  
 }  
  
 / /   R e n d e r s   t h e   i n d e x   p a g e  
 f u n c   h a n d l e I n d e x ( w   h t t p . R e s p o n s e W r i t e r ,   r   * h t t p . R e q u e s t )   {  
 	 w . H e a d e r ( ) . S e t ( " C o n t e n t - T y p e " ,   " t e x t / h t m l ;   c h a r s e t = u t f - 8 " )  
 	 w . W r i t e H e a d e r ( h t t p . S t a t u s O K )  
 	 w . W r i t e ( [ ] b y t e ( h t m l I n d e x P a g e ) )  
 }  
  
 / /   R e d i r e c t s   t o   t h e   o a u t h 2  
 f u n c   h a n d l e L o g i n ( w   h t t p . R e s p o n s e W r i t e r ,   r   * h t t p . R e q u e s t )   {  
 	 s e s s i o n   : =   g e t S e s s i o n O r A b o r t ( w ,   r )  
 	 i f   s e s s i o n   = =   n i l   {  
 	 	 r e t u r n  
 	 }  
  
 	 / /   C r e a t e   a   r a n d o m   s t a t e  
 	 s e s s i o n . V a l u e s [ " s t a t e " ]   =   r a n d S e q ( 3 2 )  
 	 s e s s i o n . S a v e ( r ,   w )  
  
 	 / /   O R   t h e   p e r m i s s i o n s   w e   w a n t  
 	 p e r m s   : =   R E A D _ M E S S A G E S   |   S E N D _ M E S S A G E S   |   C O N N E C T   |   S P E A K  
  
 	 / /   R e t u r n   a   r e d i r e c t   t o   t h e   o u a t h   p r o v i d e r  
 	 u r l   : =   o a u t h C o n f . A u t h C o d e U R L ( s e s s i o n . V a l u e s [ " s t a t e " ] . ( s t r i n g ) ,   o a u t h 2 . A c c e s s T y p e O n l i n e )  
 	 h t t p . R e d i r e c t ( w ,   r ,   u r l + f m t . S p r i n t f ( " & p e r m i s s i o n s = % v " ,   p e r m s ) ,   h t t p . S t a t u s T e m p o r a r y R e d i r e c t )  
 }  
  
 f u n c   h a n d l e C a l l b a c k ( w   h t t p . R e s p o n s e W r i t e r ,   r   * h t t p . R e q u e s t )   {  
 	 s e s s i o n   : =   g e t S e s s i o n O r A b o r t ( w ,   r )  
 	 i f   s e s s i o n   = =   n i l   {  
 	 	 r e t u r n  
 	 }  
  
 	 / /   C h e c k   t h e   s t a t e   s t r i n g   i s   c o r r e c t  
 	 s t a t e   : =   r . F o r m V a l u e ( " s t a t e " )  
 	 i f   s t a t e   ! =   s e s s i o n . V a l u e s [ " s t a t e " ]   {  
 	 	 l o g . W i t h F i e l d s ( l o g . F i e l d s {  
 	 	 	 " e x p e c t e d " :   s e s s i o n . V a l u e s [ " s t a t e " ] ,  
 	 	 	 " r e c e i v e d " :   s t a t e ,  
 	 	 } ) . E r r o r ( " I n v a l i d   O A u t h   s t a t e " )  
 	 	 h t t p . R e d i r e c t ( w ,   r ,   " / " ,   h t t p . S t a t u s T e m p o r a r y R e d i r e c t )  
 	 	 r e t u r n  
 	 }  
  
 	 e r r o r M s g   : =   r . F o r m V a l u e ( " e r r o r " )  
 	 i f   e r r o r M s g   ! =   " "   {  
 	 	 l o g . W i t h F i e l d s ( l o g . F i e l d s {  
 	 	 	 " e r r o r " :   e r r o r M s g ,  
 	 	 } ) . E r r o r ( " R e c e i v e d   O A u t h   e r r o r   f r o m   p r o v i d e r " )  
 	 	 h t t p . R e d i r e c t ( w ,   r ,   " / " ,   h t t p . S t a t u s T e m p o r a r y R e d i r e c t )  
 	 	 r e t u r n  
 	 }  
  
 	 t o k e n ,   e r r   : =   o a u t h C o n f . E x c h a n g e ( o a u t h 2 . N o C o n t e x t ,   r . F o r m V a l u e ( " c o d e " ) )  
 	 i f   e r r   ! =   n i l   {  
 	 	 l o g . W i t h F i e l d s ( l o g . F i e l d s {  
 	 	 	 " e r r o r " :   e r r ,  
 	 	 	 " t o k e n " :   t o k e n ,  
 	 	 } ) . E r r o r ( " F a i l e d   t o   e x c h a n g e   t o k e n   w i t h   p r o v i d e r " )  
 	 	 h t t p . R e d i r e c t ( w ,   r ,   " / " ,   h t t p . S t a t u s T e m p o r a r y R e d i r e c t )  
 	 	 r e t u r n  
 	 }  
  
 	 b o d y ,   _   : =   j s o n . M a r s h a l ( m a p [ i n t e r f a c e { } ] i n t e r f a c e { } { } )  
 	 r e q ,   e r r   : =   h t t p . N e w R e q u e s t ( " G E T " ,   a p i B a s e U r l + " / u s e r s / @ m e " ,   b y t e s . N e w B u f f e r ( b o d y ) )  
 	 i f   e r r   ! =   n i l   {  
 	 	 l o g . W i t h F i e l d s ( l o g . F i e l d s {  
 	 	 	 " b o d y " :     b o d y ,  
 	 	 	 " r e q " :       r e q ,  
 	 	 	 " e r r o r " :   e r r ,  
 	 	 } ) . E r r o r ( " F a i l e d   t o   c r e a t e   @ m e   r e q u e s t " )  
 	 	 h t t p . E r r o r ( w ,   " F a i l e d   t o   r e t r i e v e   u s e r   p r o f i l e " ,   h t t p . S t a t u s I n t e r n a l S e r v e r E r r o r )  
 	 	 r e t u r n  
 	 }  
  
 	 r e q . H e a d e r . S e t ( " A u t h o r i z a t i o n " ,   t o k e n . T y p e ( ) + "   " + t o k e n . A c c e s s T o k e n )  
 	 c l i e n t   : =   & h t t p . C l i e n t { T i m e o u t :   ( 2 0   *   t i m e . S e c o n d ) }  
 	 r e s p ,   e r r   : =   c l i e n t . D o ( r e q )  
 	 i f   e r r   ! =   n i l   {  
 	 	 l o g . W i t h F i e l d s ( l o g . F i e l d s {  
 	 	 	 " e r r o r " :     e r r ,  
 	 	 	 " c l i e n t " :   c l i e n t ,  
 	 	 	 " r e s p " :       r e s p ,  
 	 	 } ) . E r r o r ( " F a i l e d   t o   r e q u e s t   @ m e   d a t a " )  
 	 	 h t t p . E r r o r ( w ,   " F a i l e d   t o   r e t r i e v e   u s e r   p r o f i l e " ,   h t t p . S t a t u s I n t e r n a l S e r v e r E r r o r )  
 	 	 r e t u r n  
 	 }  
  
 	 r e s p B o d y ,   e r r   : =   i o u t i l . R e a d A l l ( r e s p . B o d y )  
 	 i f   e r r   ! =   n i l   {  
 	 	 l o g . W i t h F i e l d s ( l o g . F i e l d s {  
 	 	 	 " e r r o r " :   e r r ,  
 	 	 	 " b o d y " :     r e s p . B o d y ,  
 	 	 } ) . E r r o r ( " F a i l e d   t o   r e a d   d a t a   f r o m   H T T P   r e s p o n s e " )  
 	 	 h t t p . E r r o r ( w ,   " F a i l e d   t o   r e t r i e v e   u s e r   p r o f i l e " ,   h t t p . S t a t u s I n t e r n a l S e r v e r E r r o r )  
 	 	 r e t u r n  
 	 }  
  
 	 u s e r   : =   d i s c o r d g o . U s e r { }  
 	 e r r   =   j s o n . U n m a r s h a l ( r e s p B o d y ,   & u s e r )  
 	 i f   e r r   ! =   n i l   {  
 	 	 l o g . W i t h F i e l d s ( l o g . F i e l d s {  
 	 	 	 " d a t a " :     r e s p B o d y ,  
 	 	 	 " e r r o r " :   e r r ,  
 	 	 } ) . E r r o r ( " F a i l e d   t o   p a r s e   J S O N   p a y l o a d   f r o m   H T T P   r e s p o n s e " )  
 	 	 h t t p . E r r o r ( w ,   " F a i l e d   t o   r e t r i e v e   u s e r   p r o f i l e " ,   h t t p . S t a t u s I n t e r n a l S e r v e r E r r o r )  
 	 	 r e t u r n  
 	 }  
  
 	 / /   F i n a l l y   w r i t e   s o m e   i n f o r m a t i o n   t o   t h e   s e s s i o n   s t o r e  
 	 s e s s i o n . V a l u e s [ " t o k e n " ]   =   t o k e n . A c c e s s T o k e n  
 	 s e s s i o n . V a l u e s [ " u s e r n a m e " ]   =   u s e r . U s e r n a m e  
 	 s e s s i o n . V a l u e s [ " t a g " ]   =   u s e r . D i s c r i m i n a t o r  
 	 d e l e t e ( s e s s i o n . V a l u e s ,   " s t a t e " )  
 	 s e s s i o n . S a v e ( r ,   w )  
  
 	 / /   A n d   r e d i r e c t   t h e   u s e r   b a c k   t o   t h e   d a s h b o a r d  
 	 h t t p . R e d i r e c t ( w ,   r ,   " / " ,   h t t p . S t a t u s T e m p o r a r y R e d i r e c t )  
 }  
  
 f u n c   h a n d l e M e ( w   h t t p . R e s p o n s e W r i t e r ,   r   * h t t p . R e q u e s t )   {  
 	 s e s s i o n ,   _   : =   s t o r e . G e t ( r ,   " s e s s i o n " )  
  
 	 b o d y ,   e r r   : =   j s o n . M a r s h a l ( m a p [ s t r i n g ] i n t e r f a c e { } {  
 	 	 " u s e r n a m e " :   s e s s i o n . V a l u e s [ " u s e r n a m e " ] ,  
 	 	 " t a g " :             s e s s i o n . V a l u e s [ " t a g " ] ,  
 	 } )  
  
 	 i f   e r r   ! =   n i l   {  
 	 	 h t t p . E r r o r ( w ,   e r r . E r r o r ( ) ,   h t t p . S t a t u s I n t e r n a l S e r v e r E r r o r )  
 	 	 r e t u r n  
 	 }  
  
 	 w . H e a d e r ( ) . S e t ( " C o n t e n t - T y p e " ,   " a p p l i c a t i o n / j s o n " )  
 	 w . W r i t e ( b o d y )  
 }  
  
 f u n c   s e r v e r ( )   {  
 	 s e r v e r   : =   h t t p . N e w S e r v e M u x ( )  
 	 s e r v e r . H a n d l e F u n c ( " / " ,   h a n d l e I n d e x )  
 	 s e r v e r . H a n d l e F u n c ( " / m e " ,   h a n d l e M e )  
 	 s e r v e r . H a n d l e F u n c ( " / l o g i n " ,   h a n d l e L o g i n )  
 	 s e r v e r . H a n d l e F u n c ( " / c a l l b a c k " ,   h a n d l e C a l l b a c k )  
 	 s e r v e r . H a n d l e ( " / e v e n t s " ,   e s )  
  
 	 p o r t   : =   o s . G e t e n v ( " P O R T " )  
 	 i f   p o r t   = =   " "   {  
 	 	 p o r t   =   " 1 4 0 0 0 "  
 	 }  
  
 	 l o g . W i t h F i e l d s ( l o g . F i e l d s {  
 	 	 " p o r t " :   p o r t ,  
 	 } ) . I n f o ( " S t a r t i n g   H T T P   S e r v e r " )  
  
 	 l o g F i l e ,   e r r   : =   o s . O p e n F i l e ( " r e q u e s t s . l o g " ,   o s . O _ A P P E N D | o s . O _ W R O N L Y ,   0 6 0 0 )  
 	 i f   e r r   ! =   n i l   {  
 	 	 l o g . W i t h F i e l d s ( l o g . F i e l d s {  
 	 	 	 " e r r " :   e r r ,  
 	 	 } ) . E r r o r ( " F a i l e d   t o   o p e n   r e q u e s t s   l o g   f i l e " )  
 	 	 r e t u r n  
 	 }  
 	 d e f e r   l o g F i l e . C l o s e ( )  
  
 	 l o g g e d R o u t e r   : =   h a n d l e r s . L o g g i n g H a n d l e r ( l o g F i l e ,   s e r v e r )  
 	 h t t p . L i s t e n A n d S e r v e ( " : " + p o r t ,   l o g g e d R o u t e r )  
 }  
  
 f u n c   b r o a d c a s t L o o p ( )   {  
 	 v a r   i d   i n t   =   0  
 	 f o r   {  
 	 	 t i m e . S l e e p ( t i m e . S e c o n d   *   1 )  
  
 	 	 e s . S e n d E v e n t M e s s a g e ( s t r i n g ( N e w C o u n t U p d a t e ( ) . T o J S O N ( ) ) ,   " m e s s a g e " ,   s t r c o n v . I t o a ( i d ) )  
 	 	 i d   + =   1  
 	 }  
 }  
  
 f u n c   c o n n e c t T o R e d i s ( c o n n S t r   s t r i n g )   ( e r r   e r r o r )   {  
 	 l o g . W i t h F i e l d s ( l o g . F i e l d s {  
 	 	 " h o s t " :   c o n n S t r ,  
 	 } ) . I n f o ( " C o n n e c t i n g   t o   r e d i s " )  
  
 	 / /   O p e n   t h e   c o n n e c t i o n  
 	 r c l i   =   r e d i s . N e w C l i e n t ( & r e d i s . O p t i o n s { A d d r :   c o n n S t r ,   D B :   0 } )  
  
 	 / /   A t t e m p t   t o   p i n g   i t  
 	 _ ,   e r r   =   r c l i . P i n g ( ) . R e s u l t ( )  
  
 	 i f   e r r   ! =   n i l   {  
 	 	 l o g . W i t h F i e l d s ( l o g . F i e l d s {  
 	 	 	 " h o s t " :     c o n n S t r ,  
 	 	 	 " e r r o r " :   e r r ,  
 	 	 } ) . E r r o r ( " F a i l e d   t o   c o n n e c t   t o   r e d i s " )  
 	 	 f m t . P r i n t f ( " F a i l e d   t o   c o n n e c t   t o   r e d i s :   % s \ n " ,   e r r )  
 	 	 r e t u r n   e r r  
 	 }  
  
 	 r e t u r n   n i l  
 }  
  
 f u n c   m a i n ( )   {  
 	 v a r   (  
 	 	 C l i e n t I D           =   f l a g . S t r i n g ( " i " ,   " " ,   " O A u t h 2   C l i e n t   I D " )  
 	 	 C l i e n t S e c r e t   =   f l a g . S t r i n g ( " s " ,   " " ,   " O A t u h 2   C l i e n t   S e c r e t " )  
 	 	 R e d i s                 =   f l a g . S t r i n g ( " r " ,   " " ,   " R e d i s   C o n n e c t i o n   S t r i n g " )  
 	 	 e r r                     e r r o r  
 	 )  
 	 f l a g . P a r s e ( )  
  
 	 / /   F i r s t ,   o p e n   a   r e d i s   c o n n e c t i o n   w e   u s e   f o r   s t a t s  
 	 i f   c o n n e c t T o R e d i s ( * R e d i s )   ! =   n i l   {  
 	 	 r e t u r n  
 	 }  
  
 	 / /   N o w   s t a r t   t h e   e v e n t s o u r c e   l o o p   f o r   c l i e n t - s i d e   s t a t   u p d a t e  
 	 e s   =   e v e n t s o u r c e . N e w ( n i l ,   n i l )  
 	 d e f e r   e s . C l o s e ( )  
 	 g o   b r o a d c a s t L o o p ( )  
  
 	 / /   L o a d   t h e   H T M L   s t a t i c   p a g e  
 	 d a t a ,   e r r   : =   i o u t i l . R e a d F i l e ( " t e m p l a t e s / i n d e x . h t m l " )  
 	 i f   e r r   ! =   n i l   {  
 	 	 l o g . W i t h F i e l d s ( l o g . F i e l d s {  
 	 	 	 " e r r o r " :   e r r ,  
 	 	 } ) . E r r o r ( " F a i l e d   t o   o p e n   i n d e x . h t m l " )  
 	 	 r e t u r n  
 	 }  
 	 h t m l I n d e x P a g e   =   s t r i n g ( d a t a )  
  
 	 / /   C r e a t e   a   c o o k i e   s t o r e  
 	 s t o r e   =   s e s s i o n s . N e w C o o k i e S t o r e ( [ ] b y t e ( * C l i e n t S e c r e t ) )  
  
 	 / /   S e t u p   t h e   O A u t h 2   C o n f i g u r a t i o n  
 	 e n d p o i n t   : =   o a u t h 2 . E n d p o i n t {  
 	 	 A u t h U R L :     a p i B a s e U r l   +   " / o a u t h 2 / a u t h o r i z e " ,  
 	 	 T o k e n U R L :   a p i B a s e U r l   +   " / o a u t h 2 / t o k e n " ,  
 	 }  
  
 	 o a u t h C o n f   =   & o a u t h 2 . C o n f i g {  
 	 	 C l i e n t I D :           * C l i e n t I D ,  
 	 	 C l i e n t S e c r e t :   * C l i e n t S e c r e t ,  
 	 	 S c o p e s :               [ ] s t r i n g { " b o t " ,   " i d e n t i f y " } ,  
 	 	 E n d p o i n t :           e n d p o i n t ,  
 	 	 R e d i r e c t U R L :     " h t t p s : / / a i r h o r n b o t . c o m / c a l l b a c k " ,  
 	 }  
  
 	 s e r v e r ( )  
 }  
