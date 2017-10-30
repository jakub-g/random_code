package src.hkrrnk.balancedBrackets;

import java.io.*;
import java.util.*;
import java.text.*;
import java.math.*;
import java.util.regex.*;

public class Solution {

    static boolean isBalancedPair(char a, char z) {
        if ((a == '{' && z == '}') || (a == '[' && z == ']') || (a == '(' && z == ')')) {
            return true;
        }
        return false;
    }

    static boolean isLeftBracket(char c) {
        return c == '{' || c == '[' || c == '(';
    }

    static String isBalanced(String s) {
        int len = s.length();
        if (len % 2 == 1) {
            return "NO";
        }

        Stack<Character> stack = new Stack<>();
        for (int i = 0; i < len; i++) {
            char curr = s.charAt(i);
            if (isLeftBracket(curr)) {
                stack.push(curr);
            } else { // right bracket
                if (stack.isEmpty()) {
                    return "NO";
                }
                char prev = stack.pop();
                if (!isBalancedPair(prev, curr)) {
                    return "NO";
                }
            }
        }
        if (stack.isEmpty()) {
            return "YES";
        } else {
            return "NO";
        }
    }

    public static void main(String[] args) throws Exception {
        System.setIn(new FileInputStream("./src/hkrrnk/balancedBrackets/in.txt"));

        Scanner in = new Scanner(System.in);
        int t = in.nextInt();
        for (int a0 = 0; a0 < t; a0++) {
            String s = in.next();
            //System.out.println(s);
            String result = isBalanced(s);
            System.out.println(result);
        }
        in.close();
    }
}
