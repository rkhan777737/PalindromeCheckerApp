public class PalindromeCheckerApp {
    public static void main(String[] args) {
        // Define the input string
        String input = "madam";

        // Start the recursive check from index 0 to length - 1
        boolean isPalindrome = check(input, 0, input.length() - 1);

        // Output results to console
        System.out.println("Input : " + input);
        System.out.println("Is Palindrome? : " + isPalindrome);
    }

    /**
     * Recursively checks whether a string is a palindrome.
     * * @param s      Input string
     * @param start  Starting index
     * @param end    Ending index
     * @return true if palindrome, otherwise false
     */
    private static boolean check(String s, int start, int end) {
        // Base Condition: If pointers cross or meet, it's a palindrome
        if (start >= end) {
            return true;
        }

        // Check if characters at current positions match
        if (s.charAt(start) != s.charAt(end)) {
            return false;
        }

        // Recursive call: move indices toward the center
        return check(s, start + 1, end - 1);
    }
}