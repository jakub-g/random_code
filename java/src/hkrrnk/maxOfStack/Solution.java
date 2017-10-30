package src.hkrrnk.maxOfStack;

import java.io.*;
import java.util.*;

public class Solution {

    private static int INSTRUCTION_PUSH = 1;
    private static int INSTRUCTION_DELETE = 2;
    private static int INSTRUCTION_PRINT = 3;

    public static void main(String[] args) {
        Stack<StackNode> stack = new Stack<>();
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();

        for (int i = 0; i < n; i++) {
            int instruction = in.nextInt();
            if (instruction == INSTRUCTION_PUSH) {
                int value = in.nextInt();

                StackNode newNode = new StackNode();
                newNode.value = value;
                int maxVal = stack.isEmpty() ?
                        value:
                        Math.max(stack.peek().currentMaxValue, value);
                newNode.currentMaxValue = maxVal;
                stack.push(newNode);
            } else if (instruction == INSTRUCTION_DELETE) {
                if (!stack.isEmpty()){
                    stack.pop();
                }
            } else if (instruction == INSTRUCTION_PRINT) {
                if (!stack.isEmpty()) {
                    System.out.println(stack.peek().currentMaxValue);
                }
            }
        }
    }

    private static class StackNode {
        int value;
        int currentMaxValue;
    }
}